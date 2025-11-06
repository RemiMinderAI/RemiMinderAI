import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone, timedelta
from models.reminder_schemas import ReminderCreate, ReminderUpdate, ReminderAction
from .db_reminders import (
    create_reminder as db_create_reminder,
    get_reminder,
    get_all_reminders,
    update_reminder as db_update_reminder,
    delete_reminder as db_delete_reminder,
    mark_reminder_complete,
    snooze_reminder as db_snooze_reminder,
    skip_reminder as db_skip_reminder,
    get_next_reminders_for_patient,
    get_recent_activity_for_patient,
    get_alerts_summary,
    get_patient_info
)
from .message_generator import generate_reminder_message
from .alert_service import check_and_send_caregiver_alerts
import asyncio

logger = logging.getLogger(__name__)

ICON_MAP = {
    "medication": "💊",
    "task": "❤️",
    "appointment": "🗓️"
}

def _get_display_status(reminder: dict) -> str:
    """Calculate display status based on reminder state and time."""
    now = datetime.now(timezone.utc)
    
    # Parse scheduled_time (handle both string and datetime)
    scheduled = reminder.get('scheduled_time')
    if isinstance(scheduled, str):
        scheduled = datetime.fromisoformat(scheduled.replace('Z', '+00:00'))
    
    status = reminder.get('status')
    completed_at = reminder.get('completed_at')
    
    # Past section statuses
    if status == 'completed':
        return "Completed"
    if status == 'snoozed' and completed_at:
        return "Snoozed"
    if status == 'skipped':
        return "Skipped"
    
    # Active/Due Now (within 15 minutes of scheduled time)
    if scheduled <= now <= scheduled + timedelta(minutes=15) and status == 'pending':
        return "Due Now"
    
    # Upcoming
    if scheduled > now and status == 'pending':
        return "Upcoming"
    
    # Missed/Overdue
    if scheduled < now and status == 'pending':
        return "Missed"
    
    return "Unknown"


def _format_display_time(scheduled_time: datetime, timezone_str: str) -> str:
    """Format time for display (e.g., '8:15 PM')."""
    # For MVP, just format in UTC or assume frontend handles timezone
    return scheduled_time.strftime("%I:%M %p").lstrip('0')


def _format_relative_time(scheduled_time: datetime) -> str:
    """Format relative time (e.g., 'in 2 hours', '3 days ago')."""
    now = datetime.now(timezone.utc)
    
    # Ensure scheduled_time is timezone-aware
    if isinstance(scheduled_time, str):
        scheduled_time = datetime.fromisoformat(scheduled_time.replace('Z', '+00:00'))
    
    delta = scheduled_time - now
    
    if delta.total_seconds() < 0:
        # Past
        delta = abs(delta)
        if delta.days > 0:
            return f"{delta.days} day{'s' if delta.days != 1 else ''} ago"
        elif delta.seconds >= 3600:
            hours = delta.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        else:
            minutes = delta.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    else:
        # Future
        if delta.days > 0:
            return f"in {delta.days} day{'s' if delta.days != 1 else ''}"
        elif delta.seconds >= 3600:
            hours = delta.seconds // 3600
            return f"in {hours} hour{'s' if hours != 1 else ''}"
        else:
            minutes = delta.seconds // 60
            return f"in {minutes} minute{'s' if minutes != 1 else ''}"


def _enrich_reminder_response(reminder: dict) -> dict:
    """Add display fields to reminder for frontend."""
    scheduled_time = reminder.get('scheduled_time')
    if isinstance(scheduled_time, str):
        scheduled_time = datetime.fromisoformat(scheduled_time.replace('Z', '+00:00'))
    
    reminder['display_status'] = _get_display_status(reminder)
    reminder['icon_type'] = ICON_MAP.get(reminder.get('reminder_type'), '⏰')
    reminder['display_time'] = _format_display_time(scheduled_time, reminder.get('timezone', 'UTC'))
    reminder['relative_time'] = _format_relative_time(scheduled_time)
    
    return reminder

# ============================================================================
# REMINDER BUSINESS LOGIC
# ============================================================================

async def create_new_reminder(data: ReminderCreate) -> Optional[Dict[str, Any]]:
    """
    Create a new reminder with AI-generated message.
    """
    try:
        # Generate personalized message using AI
        message = await generate_reminder_message(
            reminder_type=data.reminder_type,
            title=data.title,
            context_data=data.context_data
        )
        
        # Prepare data for database
        reminder_data = {
            "patient_id": data.patient_id,
            "visit_id": data.visit_id,
            "reminder_type": data.reminder_type,
            "title": data.title,
            "message": message,
            "scheduled_time": data.scheduled_time,
            "timezone": data.timezone,
            "recurrence": data.recurrence
        }
        
        # Save to database
        reminder = await db_create_reminder(reminder_data)
        
        if reminder:
            logger.info(f"✅ Created reminder {reminder['id']} for patient {data.patient_id}")
            return _enrich_reminder_response(reminder)
        
        return None
        
    except Exception as e:
        logger.error(f"Error creating reminder: {str(e)}")
        raise


async def get_reminder_by_id(reminder_id: str, patient_id: str) -> Optional[Dict[str, Any]]:
    """Get a single reminder with display fields."""
    reminder = await get_reminder(reminder_id, patient_id)
    
    if reminder:
        return _enrich_reminder_response(reminder)
    
    return None


async def list_patient_reminders(patient_id: str) -> Dict[str, Any]:
    """
    Get all reminders for a patient, organized by category.
    Returns data matching frontend UI structure.
    """
    all_reminders = await get_all_reminders(patient_id)
    
    # Enrich all reminders
    enriched = [_enrich_reminder_response(r) for r in all_reminders]
    
    # Categorize reminders
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    
    today = []
    upcoming = []
    past = []
    
    for r in enriched:
        scheduled = r.get('scheduled_time')
        if isinstance(scheduled, str):
            scheduled = datetime.fromisoformat(scheduled.replace('Z', '+00:00'))
        
        status = r.get('status')
        display_status = r.get('display_status')
        
        # Past: completed, snoozed, skipped, or missed
        if status in ['completed', 'skipped'] or display_status in ['Completed', 'Snoozed', 'Skipped', 'Missed']:
            past.append(r)
        # Today: scheduled for today and still pending
        elif today_start <= scheduled < today_end and status == 'pending':
            today.append(r)
        # Upcoming: future and pending
        elif scheduled >= today_end and status == 'pending':
            upcoming.append(r)
        else:
            # Edge cases: put in today if pending
            if status == 'pending':
                today.append(r)
            else:
                past.append(r)
    
    # Calculate overview counts
    overview = {
        "total": len(enriched),
        "active_today": len(today),
        "upcoming": len(upcoming),
        "past": len(past)
    }
    
    return {
        "overview": overview,
        "today": today,
        "upcoming": upcoming,
        "past": past
    }


async def update_reminder_details(
    reminder_id: str,
    patient_id: str,
    updates: ReminderUpdate
) -> Optional[Dict[str, Any]]:
    """Update reminder details."""
    update_dict = updates.dict(exclude_unset=True)
    
    if not update_dict:
        return await get_reminder_by_id(reminder_id, patient_id)
    
    reminder = await db_update_reminder(reminder_id, patient_id, update_dict)
    
    if reminder:
        logger.info(f"✅ Updated reminder {reminder_id}")
        return _enrich_reminder_response(reminder)
    
    return None


async def cancel_reminder(reminder_id: str, patient_id: str) -> bool:
    """Delete/cancel a reminder."""
    success = await db_delete_reminder(reminder_id, patient_id)
    
    if success:
        logger.info(f"✅ Deleted reminder {reminder_id}")
    
    return success

# ============================================================================
# REMINDER INTERACTIONS
# ============================================================================
async def complete_reminder(
    reminder_id: str,
    patient_id: str,
    action_data: ReminderAction
) -> Optional[Dict[str, Any]]:
    """Mark a reminder as completed."""
    reminder = await mark_reminder_complete(reminder_id, patient_id, action_data.notes)
    
    if reminder:
        logger.info(f"✅ Completed reminder {reminder_id}")
        return _enrich_reminder_response(reminder)
    
    return None


async def snooze_reminder(
    reminder_id: str,
    patient_id: str,
    snooze_minutes: int = 30
) -> Optional[Dict[str, Any]]:
    """Snooze a reminder (only once in MVP)."""
    reminder = await db_snooze_reminder(reminder_id, patient_id, snooze_minutes)
    
    if reminder:
        logger.info(f"Snoozed reminder {reminder_id} for {snooze_minutes} minutes")
        
        # Trigger caregiver alert asynchronously
        asyncio.create_task(
            check_and_send_caregiver_alerts(reminder_id, patient_id, 'snoozed')
        )
        
        return _enrich_reminder_response(reminder)
    
    return None


async def skip_reminder(
    reminder_id: str,
    patient_id: str,
    action_data: ReminderAction
) -> Optional[Dict[str, Any]]:
    """Skip a reminder with optional reason."""
    reminder = await db_skip_reminder(reminder_id, patient_id, action_data.notes)
    
    if reminder:
        logger.info(f"✅ Skipped reminder {reminder_id}")
        
        # Trigger caregiver alert asynchronously (non-blocking)
        asyncio.create_task(
            check_and_send_caregiver_alerts(reminder_id, patient_id, 'skipped')
        )
        
        return _enrich_reminder_response(reminder)
    
    return None


# ============================================================================
# CAREGIVER DASHBOARD
# ============================================================================

async def get_caregiver_dashboard_data(caregiver_id: str, patient_id: str) -> Dict[str, Any]:
    """
    Get aggregated data for caregiver dashboard.
    """
    try:
        # Get patient info
        patient_info = await get_patient_info(patient_id)
        patient_name = patient_info.get('full_name', 'Patient') if patient_info else 'Patient'
        
        # Get next upcoming reminders
        next_reminders_raw = await get_next_reminders_for_patient(patient_id, limit=5)
        next_reminders = [
            {
                "id": r['id'],
                "title": r['title'],
                "scheduled_time": r['scheduled_time'],
                "reminder_type": r['reminder_type'],
                "status": r['status']
            }
            for r in next_reminders_raw
        ]
        
        # Get recent activity (last 24 hours)
        recent_activity_raw = await get_recent_activity_for_patient(patient_id, hours=24)
        recent_activity = [
            {
                "reminder_id": a['reminder_id'],
                "title": a.get('reminders', {}).get('title', 'Unknown'),
                "action": a['action'],
                "timestamp": a['timestamp']
            }
            for a in recent_activity_raw
        ]
        
        alerts_summary = await get_alerts_summary(caregiver_id, patient_id)
        
        return {
            "patient_id": patient_id,
            "patient_name": patient_name,
            "next_reminders": next_reminders,
            "recent_activity": recent_activity,
            "alerts_summary": alerts_summary
        }
        
    except Exception as e:
        logger.error(f"Error getting caregiver dashboard: {str(e)}")
        raise
