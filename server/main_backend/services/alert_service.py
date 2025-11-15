import logging
from typing import Optional, Dict, Any
from .db_reminders import (
    create_caregiver_alert,
    get_reminder_logs,
    get_reminder,
    get_patient_info
)
from .message_generator import generate_caregiver_alert_message
from .notification_service import send_caregiver_alert_email

logger = logging.getLogger(__name__)

# ============================================================================
# CAREGIVER ALERT LOGIC
# ============================================================================

async def get_patient_caregiver(user_id: str) -> Optional[dict]:
    """
    Get caregiver info for a patient from patient_caregiver relationship.
    Returns caregiver_id and email, or None if no caregiver assigned.
    """
    from .db_reminders import get_supabase_client
    
    supabase = get_supabase_client()
    
    try:
        # Query patient_caregiver join caregivers table
        response = (
            supabase.table("patient_caregiver")
            .select("caregiver_id, caregivers(id, email, full_name)")
            .eq("patient_id", user_id)
            .single()
            .execute()
        )
        
        if response.data:
            caregiver_data = response.data.get('caregivers')
            return {
                'caregiver_id': response.data['caregiver_id'],
                'email': caregiver_data.get('email'),
                'full_name': caregiver_data.get('full_name')
            }
        
        return None
        
    except Exception as e:
        logger.warning(f"No caregiver found for patient {user_id}: {str(e)}")
        return None

async def check_and_send_caregiver_alerts(
    reminder_id: str,
    user_id: str,
    action: str
) -> None:
    """
    Check if caregiver should be alerted based on reminder action.
    Currently alerts on: consecutive skips > 1
    """
    try:
        # Get the reminder to check consecutive_skips
        reminder = await get_reminder(reminder_id, user_id)
        if not reminder:
            return
        
        consecutive_skips = reminder.get('consecutive_skips', 0)
        
        # Alert caregiver if skipped more than once
        if action == 'skipped' and consecutive_skips > 1:
            await send_skip_alert_to_caregiver(reminder_id, user_id, consecutive_skips)
        
    except Exception as e:
        logger.error(f"Error checking caregiver alerts for reminder {reminder_id}: {str(e)}")

async def send_skip_alert_to_caregiver(
    reminder_id: str,
    user_id: str,
    skip_count: int
) -> None:
    """
    Send alert to caregiver when patient skips reminder multiple times.
    """
    try:
        # Get patient info
        patient = await get_patient_info(user_id)
        if not patient:
            logger.error(f"Patient {user_id} not found for caregiver alert")
            return
        
        patient_name = patient.get('full_name', 'Your patient')
        
        # Get reminder details
        reminder = await get_reminder(reminder_id, user_id)
        if not reminder:
            return
        
        reminder_title = reminder.get('title', 'A reminder')
                
        caregiver_info = await get_patient_caregiver(user_id)
        if not caregiver_info:
            logger.info(f"No caregiver assigned to patient {user_id}, skipping alert")
            return

        caregiver_id = caregiver_info['caregiver_id']
        caregiver_email = caregiver_info['email']
        caregiver_name = caregiver_info.get('full_name', 'Caregiver')

        # Create alert message
        alert_message = (
            f"{patient_name} has skipped '{reminder_title}' {skip_count} times in a row. "
            f"Please check in with them to ensure they're staying on track with their health routine."
        )
        
        # Save alert to database
        await create_caregiver_alert(
            caregiver_id=caregiver_id,
            user_id=user_id,
            reminder_id=reminder_id,
            alert_type="multiple_skips",
            message=alert_message
        )
        
        # Send email notification
        email_sent = await send_caregiver_alert_email(
            to_email=caregiver_email,
            patient_name=patient_name,
            alert_message=alert_message,
            alert_id=reminder_id
        )
        
        if email_sent:
            logger.info(f"Caregiver alert sent for reminder {reminder_id} (skip count: {skip_count})")
        else:
            logger.error(f"Failed to send caregiver alert for reminder {reminder_id}")
        
    except Exception as e:
        logger.error(f"Error sending caregiver alert: {str(e)}")
