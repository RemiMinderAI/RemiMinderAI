import os
import aiosmtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv() 

GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
GMAIL_NAME = os.getenv("GMAIL_NAME")

async def send_invite_email(to_email: str, invite_token: str, patient_name: str):
    invite_link = f"http://localhost:3000?token={invite_token}"

    #print("DEBUG: Invite link being sent:", invite_link)

    # Plain text version
    plain_content = f"""\
Hi,

{patient_name} has invited you to join as their caregiver on RemiMinderAI.

Click the link below to accept:
{invite_link}

If you didn’t expect this, you can safely ignore this email.
"""

    # HTML version
    html_content = f"""\
<html>
  <body style="font-family: Arial, sans-serif; line-height:1.6;">
    <h2 style="color: #333;">You're invited!</h2>
    <p><strong>{patient_name}</strong> has invited you to join as their caregiver on <strong>RemiMinderAI</strong>.</p>
    <p>
      <a href="{invite_link}" 
         style="
           display:inline-block;
           background-color:#4CAF50;
           color:white;
           padding:10px 20px;
           text-decoration:none;
           border-radius:6px;
           font-weight:bold;
         ">
        Accept Invitation
      </a>
    </p>
    <hr style="border:none; border-top:1px solid #eee;" />
    <p style="font-size:0.9em; color:#555;">
      If you didn’t expect this invitation, you can safely ignore this email.
    </p>
  </body>
</html>
"""

    message = EmailMessage()
    message["From"] = f"{GMAIL_NAME} <{GMAIL_USER}>"
    message["To"] = to_email
    message["Subject"] = f"{patient_name} invited you to join RemiMinderAI"
    message.set_content(plain_content)
    message.add_alternative(html_content, subtype='html')

    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",
        port=587,
        start_tls=True,
        username=GMAIL_USER,
        password=GMAIL_APP_PASSWORD
    )
    print(f"Email sent to {to_email}")
