from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, timezone
import uuid
from typing import cast, Dict
from services.supabase_client import supabase
from utils.auth import get_current_user
from services.invitation_email_service import send_invite_email

router = APIRouter()

# Request model (what frontend sends)
class InvitationRequest(BaseModel):
    caregiver_email: EmailStr
    caregiver_name: str

@router.post("/api/invitations/send")
async def send_invitation(
    request_data: InvitationRequest,
    current_user=Depends(get_current_user)
):
    """
    Sends caregiver invitation:
    - Verifies logged-in user is a patient
    - Creates new pending invitation
    - Generates unique token
    """
    # 1️ Get patient info from JWT
    # grab the UID of the logged-in patient from the token.
    auth_uid = current_user["sub"]  # Supabase Auth UID

    patient_record = supabase.table("users").select("id, full_name").eq("auth_uid", auth_uid).execute()
    if not patient_record.data:
        raise HTTPException(status_code=403, detail="Only patients can send invitations.")
    patient_id = patient_record.data[0]["id"]
    patient_name = str(patient_record.data[0].get("full_name", "Your patient"))

    # 2️ Check for existing pending invite to same email
    existing_invite = supabase.table("invitations") \
        .select("*") \
        .eq("patient_id", patient_id) \
        .eq("caregiver_email", request_data.caregiver_email) \
        .eq("status", "pending") \
        .execute()

    if existing_invite.data:
        invite = existing_invite.data[0]
        expires_at_existing = invite.get("expires_at")

        # 1. Invitation is accepted
        if invite["status"] == "accepted":
            raise HTTPException(
            status_code=400,
            detail="Invitation has already been accepted."
        )

        # 2. Pending invitation exists and not expired
        elif invite["status"] == "pending" and expires_at_existing > datetime.now(timezone.utc).isoformat():
            raise HTTPException(
                status_code=400, 
                detail="An active invitation already exists for this caregiver."
                )
        
        # 3. Invitation is pending but expired, generate new token and reset status to pending and send email
        else:
            invite_token = str(uuid.uuid4())
            new_expires_at = (datetime.now(timezone.utc) + timedelta(hours=48)).isoformat()

            supabase.table("invitations").update({
                "token": invite_token,
                "status": "pending",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "expires_at": new_expires_at
            }).eq("id", invite["id"]).execute()

            # send email with new token
            await send_invite_email(
                to_email=request_data.caregiver_email,
                invite_token=invite_token,
                patient_name=patient_name
            )

            return {
                "message": f"Invitation re-sent successfully to {request_data.caregiver_email}.",
                "token": invite_token,
                "expires_at": new_expires_at
            }

    # 4 Create new invitation if none exists
    invite_token = str(uuid.uuid4())
    expires_at = (datetime.now(timezone.utc) + timedelta(hours=48)).isoformat()

    # 5 Insert invitation record
    supabase.table("invitations").insert({
        "patient_id": patient_id,
        "caregiver_email": request_data.caregiver_email,
        "caregiver_name": request_data.caregiver_name,
        "token": invite_token,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": expires_at
    }).execute()

    # 5️ Send email with token link
    await send_invite_email(
        to_email=request_data.caregiver_email,
        invite_token=invite_token,
        patient_name=patient_name
        )
    
    return {
        "message": f"Invitation sent successfully to {request_data.caregiver_email}.",
        "token": invite_token,
        "expires_at": expires_at
    }