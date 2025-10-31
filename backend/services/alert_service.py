import logging
from typing import Optional, Dict, Any
from .db_reminders import (
    create_caregiver_alert,
    get_reminder,
    get_patient_info
)
from .message_generator import generate_caregiver_alert_message
from .notification_service import send_caregiver_alert_email

logger = logging.getLogger(__name__)

# ============================================================================
# CAREGIVER ALERT LOGIC
# ============================================================================

async def check_and_send_caregiver_alerts(
    reminder_id: str,
    patient_id: str,
    action: str
) -> None:
    """
    Check if a caregiver alert should be triggered based on patient action.
    This runs asynchronously in the background.
    
    Args:
        reminder_id: The reminder that was interacted with
        patient_id: The patient who performed the action
        action: 'completed', 'snoozed', 'skipped'
    """
    
    # Only send alerts for skipped or multiple snoozes
    if action not in ['skipped', 'snoozed']:
        return
    
    try:
        # Get reminder details
        reminder = await get_reminder(reminder_id, patient_id)
        if not reminder:
            logger.warning(f"Reminder {reminder_id} not found for alert check")
            return
        
        # Determine alert type
        alert_type = None
        
        if action == 'skipped':
            alert_type = 'skipped'
        
        elif action == 'snoozed':
            # Only alert if snoozed multiple times (we allow 1 snooze in MVP)
            # Since we only allow 1 snooze, this will trigger on the first snooze
            # In future, you can check reminder['snoozed_count'] > 1
            if reminder.get('snoozed_count', 0) >= 1:
                alert_type = 'multiple_snoozes'
        
        if not alert_type:
            return
        
        # Get patient info
        patient_info = await get_patient_info(patient_id)
        if not patient_info:
            logger.warning(f"Patient {patient_id} not found")
            return
        
        patient_name = patient_info.get('full_name', 'Your loved one')
        
        # Get caregiver(s) for this patient
        caregivers = await _get_caregivers_for_patient(patient_id)
        
        if not caregivers:
            logger.info(f"No caregivers found for patient {patient_id}, skipping alert")
            return
        
        # Generate alert message
        alert_message = await generate_caregiver_alert_message(
            alert_type=alert_type,
            reminder_title=reminder['title'],
            reminder_type=reminder['reminder_type'],
            patient_name=patient_name
        )
        
        # Send alerts to all caregivers
        for caregiver in caregivers:
            try:
                # Save alert to database
                alert = await create_caregiver_alert(
                    caregiver_id=caregiver['id'],
                    patient_id=patient_id,
                    reminder_id=reminder_id,
                    alert_type=alert_type,
                    message=alert_message
                )
                
                if alert:
                    # Send email notification (async, non-blocking)
                    email_sent = await send_caregiver_alert_email(
                        to_email=caregiver['email'],
                        patient_name=patient_name,
                        alert_message=alert_message,
                        alert_id=alert['id']
                    )
                    
                    if email_sent:
                        logger.info(f"Alert sent to caregiver {caregiver['email']} for {alert_type}")
                    else:
                        logger.error(f"Failed to email caregiver {caregiver['email']}")
                        
            except Exception as e:
                logger.error(f"Failed to send alert to caregiver {caregiver.get('id')}: {str(e)}")
                # Continue with other caregivers
                continue
        
    except Exception as e:
        logger.error(f"Error in check_and_send_caregiver_alerts: {str(e)}")
        # Don't re-raise - alerts are non-critical


async def _get_caregivers_for_patient(patient_id: str) -> list:
    """
    Get all caregivers linked to a patient.
    Note: This assumes you have a relationship table or field.
    """
    from .db_service import get_supabase_client
    
    supabase = get_supabase_client()
    
    try:
        # Assuming caregivers table has a way to link to patients
        # You may need to adjust this query based on your schema
        
        # Option 1: If there's a patient_id field in caregivers table
        response = (
            supabase.table("caregivers")
            .select("id, email, full_name")
            .eq("patient_id", patient_id)  # Adjust based on your schema
            .execute()
        )
        
        # Option 2: If there's a separate caregiver_patients junction table
        # response = (
        #     supabase.table("caregiver_patients")
        #     .select("caregiver:caregivers(id, email, full_name)")
        #     .eq("patient_id", patient_id)
        #     .execute()
        # )
        
        return response.data or []
        
    except Exception as e:
        logger.error(f"Error fetching caregivers for patient {patient_id}: {str(e)}")
        return []


async def trigger_alert_for_missed_reminder(reminder_id: str, patient_id: str) -> None:
    """
    Manually trigger an alert for a missed reminder.
    Called by the scheduler when a reminder is overdue.
    """
    await check_and_send_caregiver_alerts(
        reminder_id=reminder_id,
        patient_id=patient_id,
        action='skipped'  # Treat missed as skipped
    )
    