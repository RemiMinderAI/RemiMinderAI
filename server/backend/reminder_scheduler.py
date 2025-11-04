import asyncio
import logging
from datetime import datetime, timezone
from services.db_reminders import (
    get_pending_reminders,
    create_recurring_reminder,
    update_reminder,
    log_reminder_action,
    get_patient_info
)
from services.notification_service import send_reminder_email, verify_email_configuration

from dotenv import load_dotenv
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def process_reminder(reminder: dict) -> bool:
    """
    Process a single reminder: send notification and handle recurrence.
    Returns True if successful, False otherwise.
    """
    try:
        reminder_id = reminder['id']
        patient_id = reminder['patient_id']
        
        # 1. Get patient info
        patient = await get_patient_info(patient_id)
        if not patient:
            logger.error(f"Patient {patient_id} not found for reminder {reminder_id}")
            return False
        
        # 2. Send notification email
        email_sent = await send_reminder_email(
            to_email=patient['email'],
            subject=f"Reminder: {reminder['title']}",
            message_body=reminder['message'],
            reminder_id=reminder_id
        )
        
        if not email_sent:
            logger.error(f"Failed to send email for reminder {reminder_id}")
            return False
        
        # 3. Log the notification
        await log_reminder_action(
            reminder_id=reminder_id,
            patient_id=patient_id,
            action="sent",
            notes="Email notification sent"
        )
        
        await update_reminder(
            reminder_id=reminder_id,
            patient_id=patient_id,
            updates={"status": "completed"}
        )
        
        # 5. Handle recurring reminders
        if reminder.get('recurrence') and reminder['recurrence'] != 'once':
            new_reminder = await create_recurring_reminder(reminder)
            if new_reminder:
                logger.info(f"Created recurring reminder {new_reminder['id']} from {reminder_id}")
            else:
                logger.warning(f"Failed to create recurring reminder from {reminder_id}")
        
        logger.info(f"Successfully processed reminder {reminder_id}")
        return True
        
    except Exception as e:
        logger.error(f"Error processing reminder {reminder.get('id')}: {str(e)}")
        return False


async def run_scheduler():
    """
    Main scheduler function: fetch and process all pending reminders.
    """
    try:
        logger.info("🔄 Starting reminder scheduler run...")
        
        # Fetch all pending reminders
        reminders = await get_pending_reminders()
        logger.info(f"📋 Found {len(reminders)} reminders to process")
        
        if not reminders:
            logger.info("✅ No reminders to process")
            return
        
        # Process each reminder
        success_count = 0
        fail_count = 0
        
        for reminder in reminders:
            success = await process_reminder(reminder)
            if success:
                success_count += 1
            else:
                fail_count += 1
        
        logger.info(f"✅ Processed {success_count} reminders successfully")
        if fail_count > 0:
            logger.warning(f"⚠️ Failed to process {fail_count} reminders")
        
    except Exception as e:
        logger.error(f"❌ Scheduler run failed: {str(e)}")


async def health_check():
    """Verify system health before running scheduler."""
    try:
        # Check SES configuration
        ses_ok = await verify_email_configuration()
        if not ses_ok:
            logger.warning("SES configuration issues detected")
            return False
        
        logger.info("✅ All health checks passed")
        return True
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return False


async def main():
    """Main entry point for the scheduler."""
    try:
        # Run health check
        healthy = await health_check()
        if not healthy:
            logger.warning("Health check failed, but continuing with scheduler run")
        
        # Run the scheduler
        await run_scheduler()
        
    except KeyboardInterrupt:
        logger.info("Scheduler interrupted by user")
    except Exception as e:
        logger.error(f"Scheduler error: {str(e)}")


if __name__ == "__main__":
    asyncio.run(main())
