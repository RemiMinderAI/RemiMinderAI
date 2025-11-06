
import os
import boto3
from botocore.exceptions import ClientError
from typing import Optional
import logging
import asyncio 

logger = logging.getLogger(__name__)

# ============================================================================
# AWS SES EMAIL SERVICE
# ============================================================================

# Use a global variable for caching the client
_ses_client = None

def get_ses_client():
    """
    Initialize or return the cached AWS SES client.
    Note: Boto3 automatically finds credentials from environment variables 
    (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) and shared credentials file.
    """
    global _ses_client
    if _ses_client is None:
        # Pass credentials explicitly if they aren't available through default mechanisms
        # Otherwise, Boto3 handles credentials implicitly and securely.
        aws_region = os.getenv("AWS_REGION", "us-east-2")
        _ses_client = boto3.client(
            'ses',
            region_name=aws_region
        )
    return _ses_client


async def send_reminder_email(
    to_email: str,
    subject: str,
    message_body: str,
    reminder_id: Optional[str] = None
) -> bool:
    """
    Send a reminder email via AWS SES.
    """
    
    # TEST MODE: Override recipient with verified test email
    SEND_TEST_EMAIL = os.getenv("SEND_TEST_EMAIL", "false").lower() == "true"
    VERIFIED_TEST_EMAIL = os.getenv("VERIFIED_TEST_EMAIL")
    
    original_email = to_email
    if SEND_TEST_EMAIL and VERIFIED_TEST_EMAIL:
        logger.info(f"🧪 TEST MODE: Redirecting email from {to_email} to {VERIFIED_TEST_EMAIL}")
        to_email = VERIFIED_TEST_EMAIL
    
    # Get sender email from environment
    sender_email = os.getenv("SES_SENDER_EMAIL")
    if not sender_email:
        logger.error("SES_SENDER_EMAIL not configured")
        return False
    
    try:
        ses_client = get_ses_client()
        
        html_body = f"""
        <html>
            <head></head>
            <body>
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">RemiMinder AI</h2>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="font-size: 16px; line-height: 1.6; color: #1f2937;">
                            {message_body}
                        </p>
                    </div>
                    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                        You're receiving this because you have an active reminder.
                    </p>
                    <p style="font-size: 12px; color: #9ca3af;">
                        RemeMinder - Helping you stay on track with your health
                    </p>
                </div>
            </body>
        </html>
        """
        
        text_body = message_body
        
        # 👈 FIX 2: Use await asyncio.to_thread to make the blocking Boto3 call non-blocking
        response = await asyncio.to_thread(
            ses_client.send_email,
            Source=sender_email,
            Destination={'ToAddresses': [to_email]},
            Message={
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': {
                    'Text': {'Data': text_body, 'Charset': 'UTF-8'},
                    'Html': {'Data': html_body, 'Charset': 'UTF-8'}
                }
            }
        )
        
        message_id = response.get('MessageId')
        logger.info(f"Email sent successfully. MessageID: {message_id} | To: {to_email} | Reminder: {reminder_id}")
        
        if SEND_TEST_EMAIL:
            logger.info(f"   (Original recipient was: {original_email})")
        
        return True
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        logger.error(f"SES ClientError: {error_code} - {error_message}")
        logger.error(f"   To: {to_email} | Reminder: {reminder_id}")
        return False
        
    except Exception as e:
        logger.error(f"Unexpected error sending email: {str(e)}")
        logger.error(f"   To: {to_email} | Reminder: {reminder_id}")
        return False


async def send_caregiver_alert_email(
    to_email: str,
    patient_name: str,
    alert_message: str,
    alert_id: Optional[str] = None
) -> bool:
    """
    Send a caregiver alert email.
    """
    
    subject = f"Alert: {patient_name} - Reminder Update"
    
    # You don't need a custom HTML body here because send_reminder_email 
    # already generates a well-formatted body using the message_body input.
    # The existing implementation is correct by calling send_reminder_email.
    
    return await send_reminder_email(
        to_email=to_email,
        subject=subject,
        message_body=alert_message,
        reminder_id=alert_id
    )


async def verify_email_configuration() -> bool:
    """
    Verify that SES is properly configured.
    """
    try:
        ses_client = get_ses_client()
        
        # Check if sender email is verified
        sender_email = os.getenv("SES_SENDER_EMAIL")
        if not sender_email:
            logger.error("SES_SENDER_EMAIL not set")
            return False
        
        # 👈 FIX 3: Use await asyncio.to_thread for the blocking get_identity_verification_attributes call
        response = await asyncio.to_thread(
            ses_client.get_identity_verification_attributes,
            Identities=[sender_email]
        )
        
        attrs = response.get('VerificationAttributes', {})
        status = attrs.get(sender_email, {}).get('VerificationStatus')
        
        if status == 'Success':
            logger.info(f"SES sender email verified: {sender_email}")
            return True
        else:
            logger.warning(f"SES sender email not verified: {sender_email} (Status: {status})")
            return False
            
    except Exception as e:
        logger.error(f"SES configuration check failed: {str(e)}")
        return False
    
