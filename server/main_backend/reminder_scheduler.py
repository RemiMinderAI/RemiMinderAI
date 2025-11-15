import asyncio
import logging
from datetime import datetime, timezone
from main_backend.services.db_reminders import (
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
        user_id = reminder['user_id']

        current_status = reminder.get('status')
        if current_status not in ['pending', 'snoozed']:
            logger.info(f"Skipping reminder {reminder_id} - already {current_status}")
            return True       
        
        # 1. Get patient info
        patient = await get_patient_info(user_id)
        if not patient:
            logger.error(f"Patient {user_id} not found for reminder {reminder_id}")
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
            
            # Increment retry count
            current_retry = reminder.get('retry_count', 0)
            new_retry_count = current_retry + 1
            
            if new_retry_count >= 2:
                # Max retries reached - mark as failed
                await update_reminder(
                    reminder_id=reminder_id,
                    user_id=user_id,
                    updates={"status": "failed", "retry_count": new_retry_count}
                )
                logger.error(f"Reminder {reminder_id} marked as FAILED after 2 retry attempts")
            else:
                # Increment retry, keep as pending/snoozed
                await update_reminder(
                    reminder_id=reminder_id,
                    user_id=user_id,
                    updates={"retry_count": new_retry_count}
                )
                logger.warning(f"Retry {new_retry_count}/2 for reminder {reminder_id}")

            return False
            
        # 3. Log the notification
        await log_reminder_action(
            reminder_id=reminder_id,
            user_id=user_id,
            action="sent",
            notes="Email notification sent"
        )
        
        await update_reminder(
            reminder_id=reminder_id,
            user_id=user_id,
            updates={"status": "completed", "consecutive_skips": 0}
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


async def auto_skip_missed_reminders():
    """
    Auto-skip reminders that are 24+ hours overdue.
    This allows caregiver alerts for repeated skips.
    """
    try:
        from main_backend.services.db_reminders import (
            get_missed_reminders_for_auto_skip,
            update_reminder,
            log_reminder_action,
            create_recurring_reminder
        )
        
        missed_reminders = await get_missed_reminders_for_auto_skip()
        
        if not missed_reminders:
            return
        
        logger.info(f"Auto-skipping {len(missed_reminders)} missed reminders...")
        
        for reminder in missed_reminders:
            reminder_id = reminder['id']
            user_id = reminder['user_id']
            
            # Increment consecutive_skips
            current_skips = reminder.get('consecutive_skips', 0)
            new_skip_count = current_skips + 1
            
            # Mark as skipped
            await update_reminder(
                reminder_id=reminder_id,
                user_id=user_id,
                updates={
                    "status": "skipped",
                    "consecutive_skips": new_skip_count
                }
            )
            
            # Log the auto-skip action
            await log_reminder_action(
                reminder_id=reminder_id,
                user_id=user_id,
                action="skipped",
                notes="Auto-skipped: 24+ hours overdue"
            )
            
            # Create next recurring instance if applicable
            if reminder.get('recurrence') and reminder['recurrence'] != 'once':
                new_reminder = await create_recurring_reminder(reminder)
                if new_reminder:
                    logger.info(f"Created next recurring reminder from auto-skipped {reminder_id}")
            
            logger.info(f"Auto-skipped reminder {reminder_id} (skip count: {new_skip_count})")
            
    except Exception as e:
        logger.error(f"Error in auto_skip_missed_reminders: {str(e)}")

async def run_scheduler():
    """
    Main scheduler function: fetch and process all pending reminders.
    """
    try:
        logger.info("🔄 Starting reminder scheduler run...")
        
        await auto_skip_missed_reminders()

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
        
        logger.info(f"Processed {success_count} reminders successfully")
        if fail_count > 0:
            logger.warning(f"Failed to process {fail_count} reminders")
        
    except Exception as e:
        logger.error(f"Scheduler run failed: {str(e)}")


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
