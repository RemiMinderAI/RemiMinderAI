#backend\services\db_reminders.py
import os
from supabase import create_client, Client
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta, timezone
from dateutil import parser
import uuid

from dotenv import load_dotenv
load_dotenv()

def get_supabase_client() -> Client:
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async def create_reminder(data: dict) -> Optional[Dict[str, Any]]:
    """Create a new reminder in the database."""
    supabase = get_supabase_client()
    
    if isinstance(data["user_id"], uuid.UUID):
        data["user_id"] = str(data["user_id"])
    if "visit_id" in data and isinstance(data["visit_id"], uuid.UUID):
        data["visit_id"] = str(data["visit_id"])

    reminder_data = {
        "user_id": data["user_id"],
        "visit_id": data.get("visit_id"),
        "reminder_type": data["reminder_type"],
        "title": data["title"],
        "message": data["message"],
        "scheduled_time": data["scheduled_time"].isoformat(),
        "timezone": data["timezone"],
        "recurrence": data.get("recurrence", "once"),
        "status": "pending"
    }
    
    response = supabase.table("reminders").insert(reminder_data).execute()
    return response.data[0] if response.data else None


async def insert_ai_reminders(
    ai_summary_result: Dict, 
    user_id: str, 
    visit_id: str
) -> List[Optional[Dict[str, Any]]]:
    """
    Transforms AI-generated reminders into the UTC-based database schema format 
    and inserts them into the 'reminders' table using the existing create_reminder function.
    """
    
    DEFAULT_TIMEZONE_STRING: str = 'America/New_York'
    now_utc = datetime.now(timezone.utc)
    
    reminders_to_insert = ai_summary_result.get("reminders", [])
    inserted_reminders = []
    
    for reminder_item in reminders_to_insert:
        scheduled_datetime_utc = None
        
        # 1. Title/Message mapping
        title = ai_summary_result.get("title", "Doctor Office Visit") 
        message = reminder_item["text"] 

        # 2. Type and Recurrence
        reminder_type = reminder_item["type"]
        recurrence = reminder_item.get("recurrence", "once")

        # 3. Scheduled Time Transformation
        scheduled_date_str = reminder_item.get("scheduled_date", "")
        scheduled_time_str = reminder_item.get("scheduled_time", "")
        
        # Case A: Specific date provided
        if scheduled_date_str:
            try:
                # Combine date and time, default to '00:00' if no time is provided
                datetime_str = f"{scheduled_date_str} {scheduled_time_str or '00:00'}"
                
                # Parse as naive, then explicitly replace the timezone with UTC.
                dt_naive = parser.parse(datetime_str) 
                scheduled_datetime_utc = dt_naive.replace(tzinfo=timezone.utc)

            except Exception as e:
                # If date string is unparseable, skip this reminder item.
                print(f"Warning: Failed to parse date/time for reminder '{message}'. Skipping. Error: {e}")
                continue 

        # Case B: Recurring task (e.g., 'daily') with NO specific date/time 
        elif recurrence != 'once':
            # Set the first instance for tomorrow at 8 AM UTC.
            scheduled_datetime_utc = now_utc + timedelta(days=1)
            scheduled_datetime_utc = scheduled_datetime_utc.replace(
                hour=8, minute=0, second=0, microsecond=0
            )
        
        # 4. Insertion Guard
        if scheduled_datetime_utc is not None:

            db_data = {
                "user_id": user_id,
                "visit_id": visit_id,
                "reminder_type": reminder_type,
                "title": title,
                "message": message,
                "scheduled_time": scheduled_datetime_utc, # This is the UTC datetime object
                "timezone": DEFAULT_TIMEZONE_STRING, 
                "recurrence": recurrence,
            }

            try:
                inserted = await create_reminder(db_data) 
                inserted_reminders.append(inserted)
            except Exception as e:
                print(f"Error inserting reminder: {message}. Exception: {e}")
                inserted_reminders.append(None)
                
    return inserted_reminders

async def get_reminder(reminder_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a single reminder by ID."""
    supabase = get_supabase_client()
    
    response = (
        supabase.table("reminders")
        .select("*")
        .eq("id", reminder_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    
    return response.data if response.data else None

async def get_all_reminders(user_id: str) -> List[Dict[str, Any]]:
    """Fetch all reminders for a patient."""
    supabase = get_supabase_client()
    
    response = (
        supabase.table("reminders")
        .select("*")
        .eq("user_id", user_id)
        .order("scheduled_time", desc=False)
        .execute()
    )
    
    return response.data or []


async def update_reminder(reminder_id: str, user_id: str, updates: dict) -> Optional[Dict[str, Any]]:
    """Update a reminder."""
    supabase = get_supabase_client()
    
    # Convert datetime to ISO string if present
    if "scheduled_time" in updates and isinstance(updates["scheduled_time"], datetime):
        updates["scheduled_time"] = updates["scheduled_time"].isoformat()
    
    response = (
        supabase.table("reminders")
        .update(updates)
        .eq("id", reminder_id)
        .eq("user_id", user_id)
        .execute()
    )
    
    return response.data[0] if response.data else None


async def delete_reminder(reminder_id: str, user_id: str) -> bool:
    """Delete a reminder."""
    supabase = get_supabase_client()
    
    response = (
        supabase.table("reminders")
        .delete()
        .eq("id", reminder_id)
        .eq("user_id", user_id)
        .execute()
    )
    
    return len(response.data) > 0 if response.data else False


# ============================================================================
# REMINDER STATUS UPDATES
# ============================================================================

async def mark_reminder_complete(reminder_id: str, user_id: str, notes: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Mark a reminder as completed."""
    supabase = get_supabase_client()
    
    now = datetime.now(timezone.utc)
    
    # Update reminder status
    reminder = await update_reminder(
        reminder_id, 
        user_id, 
        {
            "status": "completed",
            "completed_at": now.isoformat()
        }
    )
    
    if reminder:
        # Log the action
        await log_reminder_action(reminder_id, user_id, "completed", notes)
    
    return reminder


async def snooze_reminder(reminder_id: str, user_id: str, snooze_minutes: int = 30) -> Optional[Dict[str, Any]]:
    """Snooze a reminder once."""
    supabase = get_supabase_client()
    
    # Get current reminder
    reminder = await get_reminder(reminder_id, user_id)
    if not reminder:
        return None
    
    # Check if already snoozed once (MVP: only allow one snooze)
    if reminder.get("snoozed_count", 0) >= 1:
        return None  # Already snoozed once
    
    now = datetime.now(timezone.utc)
    snooze_until = now + timedelta(minutes=snooze_minutes)
    
    # Update reminder
    updated = await update_reminder(
        reminder_id,
        user_id,
        {
            "status": "snoozed",
            "snoozed_count": reminder.get("snoozed_count", 0) + 1,
            "snooze_until": snooze_until.isoformat()
        }
    )
    
    if updated:
        # Log the action
        await log_reminder_action(reminder_id, user_id, "snoozed", f"Snoozed for {snooze_minutes} minutes")
    
    return updated


async def skip_reminder(reminder_id: str, user_id: str, reason: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Skip a reminder."""
    supabase = get_supabase_client()
    
    # Update reminder status
    reminder = await update_reminder(
        reminder_id,
        user_id,
        {"status": "skipped"}
    )
    
    if reminder:
        # Log the action with reason
        await log_reminder_action(reminder_id, user_id, "skipped", reason)
    
    return reminder


# ============================================================================
# REMINDER LOGS
# ============================================================================

async def log_reminder_action(
    reminder_id: str,
    user_id: str,
    action: str,
    notes: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """Log a reminder action to reminder_logs table."""
    supabase = get_supabase_client()

    if isinstance(reminder_id, uuid.UUID):
        reminder_id = str(reminder_id)
    if isinstance(user_id, uuid.UUID):
        user_id = str(user_id)

    log_data = {
        "reminder_id": reminder_id,
        "user_id": user_id,
        "action": action,
        "notes": notes
    }
    
    response = supabase.table("reminder_logs").insert(log_data).execute()
    return response.data[0] if response.data else None


async def get_reminder_logs(reminder_id: str) -> List[Dict[str, Any]]:
    """Fetch all logs for a specific reminder."""
    supabase = get_supabase_client()
    
    response = (
        supabase.table("reminder_logs")
        .select("*")
        .eq("reminder_id", reminder_id)
        .order("timestamp", desc=True)
        .execute()
    )
    
    return response.data or []


# ============================================================================
# SCHEDULER QUERIES
# ============================================================================

async def get_pending_reminders() -> List[Dict[str, Any]]:
    """Fetch all pending reminders that are due now (for scheduler)."""
    supabase = get_supabase_client()
    
    now = datetime.now(timezone.utc).isoformat()
    
    response = (
        supabase.table("reminders")
        .select("*")
        .eq("status", "pending")
        .lte("scheduled_time", now)
        .is_("snooze_until", "null")  # Not snoozed
        .execute()
    )
    
    # Also check snoozed reminders that are ready
    snoozed_response = (
        supabase.table("reminders")
        .select("*")
        .eq("status", "snoozed")
        .lte("snooze_until", now)
        .execute()
    )
    
    all_reminders = (response.data or []) + (snoozed_response.data or [])
    return all_reminders


async def create_recurring_reminder(original_reminder: dict) -> Optional[Dict[str, Any]]:
    """Create a new reminder for recurring schedule (used by scheduler)."""
    supabase = get_supabase_client()
    
    # Parse original scheduled time
    original_time = datetime.fromisoformat(original_reminder["scheduled_time"].replace("Z", "+00:00"))
    
    # Calculate next scheduled time based on recurrence
    if original_reminder["recurrence"] == "daily":
        next_time = original_time + timedelta(days=1)
    elif original_reminder["recurrence"] == "weekly":
        next_time = original_time + timedelta(weeks=1)
    else:
        return None  # No recurrence
    
    # Create new reminder (copy of original with new time)
    new_reminder_data = {
        "user_id": original_reminder["user_id"],
        "visit_id": original_reminder.get("visit_id"),
        "reminder_type": original_reminder["reminder_type"],
        "title": original_reminder["title"],
        "message": original_reminder["message"],
        "scheduled_time": next_time.isoformat(),
        "timezone": original_reminder["timezone"],
        "recurrence": original_reminder["recurrence"],
        "status": "pending"
    }
    
    response = supabase.table("reminders").insert(new_reminder_data).execute()
    return response.data[0] if response.data else None


# ============================================================================
# CAREGIVER QUERIES
# ============================================================================

async def get_patient_info(user_id: str) -> Optional[Dict[str, Any]]:
    """Get patient name and email."""
    supabase = get_supabase_client()
    
    response = (
        supabase.table("users")
        .select("id, full_name, email")
        .eq("id", user_id)
        .single()
        .execute()
    )
    
    return response.data if response.data else None


async def get_next_reminders_for_patient(user_id: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Get next upcoming reminders for caregiver dashboard."""
    supabase = get_supabase_client()
    
    now = datetime.now(timezone.utc).isoformat()
    
    response = (
        supabase.table("reminders")
        .select("id, title, scheduled_time, reminder_type, status")
        .eq("user_id", user_id)
        .eq("status", "pending")
        .gte("scheduled_time", now)
        .order("scheduled_time", desc=False)
        .limit(limit)
        .execute()
    )
    
    return response.data or []


async def get_recent_activity_for_patient(user_id: str, hours: int = 24) -> List[Dict[str, Any]]:
    """Get recent reminder activity for caregiver dashboard."""
    supabase = get_supabase_client()
    
    cutoff_time = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()
    
    response = (
        supabase.table("reminder_logs")
        .select("reminder_id, action, timestamp, reminders(title)")
        .eq("user_id", user_id)
        .gte("timestamp", cutoff_time)
        .order("timestamp", desc=True)
        .execute()
    )
    
    return response.data or []


async def create_caregiver_alert(
    caregiver_id: str,
    user_id: str,
    reminder_id: str,
    alert_type: str,
    message: str
) -> Optional[Dict[str, Any]]:
    """Create a caregiver alert."""
    supabase = get_supabase_client()
    
    for key, val in {"caregiver_id": caregiver_id, "user_id": user_id, "reminder_id": reminder_id}.items():
        if isinstance(val, uuid.UUID):
            locals()[key] = str(val)

    alert_data = {
        "caregiver_id": caregiver_id,
        "user_id": user_id,
        "reminder_id": reminder_id,
        "alert_type": alert_type,
        "message": message
    }
    
    response = supabase.table("caregiver_alerts").insert(alert_data).execute()
    return response.data[0] if response.data else None


async def get_caregiver_alerts(caregiver_id: str, unread_only: bool = False) -> List[Dict[str, Any]]:
    """Get alerts for a caregiver."""
    supabase = get_supabase_client()
    
    query = (
        supabase.table("caregiver_alerts")
        .select("*")
        .eq("caregiver_id", caregiver_id)
        .order("sent_at", desc=True)
    )
    
    if unread_only:
        query = query.eq("read", False)
    
    response = query.execute()
    return response.data or []


async def mark_alert_as_read(alert_id: str, caregiver_id: str) -> Optional[Dict[str, Any]]:
    """Mark a caregiver alert as read."""
    supabase = get_supabase_client()
    
    response = (
        supabase.table("caregiver_alerts")
        .update({"read": True})
        .eq("id", alert_id)
        .eq("caregiver_id", caregiver_id)
        .execute()
    )
    
    return response.data[0] if response.data else None


async def get_alerts_summary(caregiver_id: str, user_id: str) -> Dict[str, int]:
    """Get alert summary counts for caregiver dashboard."""
    supabase = get_supabase_client()
    
    # Count unread alerts
    unread_response = (
        supabase.table("caregiver_alerts")
        .select("id", count="exact")
        .eq("caregiver_id", caregiver_id)
        .eq("user_id", user_id)
        .eq("read", False)
        .execute()
    )
    
    # Count missed today
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    missed_response = (
        supabase.table("reminder_logs")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .eq("action", "skipped")
        .gte("timestamp", today_start)
        .execute()
    )
    
    # Count multiple snoozes
    snoozed_response = (
        supabase.table("caregiver_alerts")
        .select("id", count="exact")
        .eq("caregiver_id", caregiver_id)
        .eq("user_id", user_id)
        .eq("alert_type", "multiple_snoozes")
        .eq("read", False)
        .execute()
    )
    
    return {
        "unread_alerts": unread_response.count or 0,
        "missed_today": missed_response.count or 0,
        "snoozed_multiple": snoozed_response.count or 0
    }


# ============================================================================
# TEMPLATE QUERIES
# ============================================================================

async def get_reminder_template(template_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a reminder message template."""
    supabase = get_supabase_client()
    
    response = (
        supabase.table("reminder_templates")
        .select("*")
        .eq("id", template_id)
        .single()
        .execute()
    )
    
    return response.data if response.data else None


async def get_templates_by_type(reminder_type: str) -> List[Dict[str, Any]]:
    """Get all templates for a specific reminder type."""
    supabase = get_supabase_client()
    
    response = (
        supabase.table("reminder_templates")
        .select("*")
        .eq("reminder_type", reminder_type)
        .execute()
    )
    
    return response.data or []

