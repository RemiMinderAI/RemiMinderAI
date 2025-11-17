from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, timezone
import uuid
from typing import cast, Dict
from services.supabase_client import supabase
from utils.auth import get_current_user
from services.invitation_email_service import send_invite_email
from services.invitation_verify_service import verify_invitation_token

#router = APIRouter()
router = APIRouter(prefix="/api/invitations", tags=["Invitations"])

# Request model (what frontend sends)
class InvitationRequest(BaseModel):
    caregiver_email: EmailStr
    caregiver_name: str

# @router.post("/api/invitations/send")
@router.post("/send")
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
            try:
                await send_invite_email(
                    to_email=request_data.caregiver_email,
                    invite_token=invite_token,
                    patient_name=patient_name
                )
            except Exception as e:
                print(f"Failed to send invitation email to {request_data.caregiver_email}: {e}")

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
    try:
        await send_invite_email(
            to_email=request_data.caregiver_email,
            invite_token=invite_token,
            patient_name=patient_name
        )
    except Exception as e:
        print(f"Failed to send invitation email to {request_data.caregiver_email}: {e}")
        # Continue anyway, as the invitation is created in DB

    return {
        "message": f"Invitation sent successfully to {request_data.caregiver_email}.",
        "token": invite_token,
        "expires_at": expires_at
    }

# Verify invite token
@router.get("/verify")
async def verify_invitation(token: str = Query(..., description="Unique invitation token")):
    """
    Verify invitation token and return associated patient/caregiver info.
    """
    invitation_data = await verify_invitation_token(token)
    
    if not invitation_data:
        raise HTTPException(status_code=404, detail="Invalid or expired invitation token.")
    
    return {
        "valid": True,
        "patient_name": invitation_data["patient_name"],
        "patient_id": invitation_data["patient_id"],
        "caregiver_email": invitation_data["caregiver_email"],
        "status": invitation_data["status"]
    }

class AcceptInvitationRequest(BaseModel):
    token: str

@router.post("/accept", status_code=status.HTTP_200_OK)
async def accept_invitation(request: AcceptInvitationRequest):
    """
    Accept an invitation using a valid token.
    Steps:
    1. Validate token
    2. Check if caregiver exists
    3. If caregiver exists → mark invitation as accepted + link patient
    4. If caregiver not found → return 'new_user' (registration required)
    """
    try:
        token = request.token

        # 1️⃣ Verify token validity
        invitation_data = await verify_invitation_token(token)
        if not invitation_data:
            raise HTTPException(status_code=404, detail="Invalid or expired invitation token.")
        
        #debugging only
        print("Invitation data:", invitation_data)

        caregiver_email = invitation_data["caregiver_email"]
        patient_id = invitation_data["patient_id"]

        # Optional safety check (make sure token belongs to this email)
        # if caregiver_email.lower() != email.lower():
        #     raise HTTPException(
        #         status_code=400,
        #         detail="Email does not match the invitation token."
        #     )

        # 2️⃣ Check caregiver record in DB
        caregiver_res = supabase.table("caregivers").select("id").eq("email", caregiver_email).execute()
        caregiver = caregiver_res.data[0] if caregiver_res.data else None

        #debugging only
        print("Caregiver lookup result:", caregiver)

        # 3️⃣ Handle new user case
        if not caregiver:
            return {
                "status": "new_user",
                "message": "Caregiver not registered yet. Please complete registration.",
                "caregiver_email": caregiver_email,
                "patient_id": patient_id,
            }

        caregiver_id = caregiver["id"]

        # 4️⃣ Update invitation status to accepted
        supabase.table("invitations").update({
            "status": "accepted",
            "accepted_at": datetime.now(timezone.utc).isoformat(),
        }).eq("token", token).execute()

        # 5️⃣ Link caregiver ↔ patient if not already linked
        existing_link = supabase.table("patient_caregiver") \
            .select("id") \
            .eq("patient_id", patient_id) \
            .eq("caregiver_id", caregiver_id) \
            .execute()

        if not existing_link.data:
            supabase.table("patient_caregiver").insert({
                "patient_id": patient_id,
                "caregiver_id": caregiver_id,
                "linked_at": datetime.now(timezone.utc).isoformat(),
            }).execute()

        return {
            "status": "accepted",
            "message": "Invitation accepted successfully.",
            "patient_id": patient_id,
            "caregiver_id": caregiver_id,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# --------------------------------------------------------------------


class CompleteInvitationRequest(BaseModel):
    token: str
    full_name: str
    phone_number: str
    email: str #frontend should store it from verify token stage and send it back
    notes: str | None = None


@router.post("/complete", status_code=status.HTTP_201_CREATED)
async def complete_invitation(request: CompleteInvitationRequest):
    """
    Step 2: After registration, mark invitation as accepted and link caregiver ↔ patient.
    - Verifies the invitation token (securely fetches patient_id from backend)
    - Creates caregiver record (if not exists)
    - Updates invitation status
    - Links caregiver ↔ patient
    """
    try:
        token = request.token
        email = request.email

        # 1️⃣ Verify token validity (defensive check)
        invitation_data = await verify_invitation_token(token)
        if not invitation_data:
            raise HTTPException(status_code=404, detail="Invalid or expired invitation token.")

        caregiver_email = invitation_data["caregiver_email"]
        patient_id = invitation_data["patient_id"]

        #debugging only
        print("Invitation data:", invitation_data)

        # Optional safety check (make sure token belongs to this email)
        if caregiver_email.lower() != email.lower():
            raise HTTPException(
                status_code=400,
                detail="Email does not match the invitation token."
            )

        # 2️ Check caregiver existence
        caregiver_res = supabase.table("caregivers").select("id").eq("email", email).execute()
        caregiver = caregiver_res.data[0] if caregiver_res.data else None

        #debugging only
        print("Caregiver lookup result:", caregiver)

        # 3️ Create caregiver record if not exists
        if not caregiver:
            insert_res = supabase.table("caregivers").insert({
                "full_name": request.full_name,
                "phone": request.phone_number,
                "email": email,
                "notes": request.notes,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }).execute()

            if not insert_res.data:
                raise HTTPException(status_code=500, detail="Failed to create caregiver record.")

            caregiver_id = insert_res.data[0]["id"]
        else:
            caregiver_id = caregiver["id"]

        # 4 Update invitation status → accepted
        supabase.table("invitations").update({
            "status": "accepted",
            "accepted_at": datetime.now(timezone.utc).isoformat(),
        }).eq("token", token).execute()

        # 5️ Link caregiver ↔ patient if not already linked
        existing_link = supabase.table("patient_caregiver") \
            .select("id") \
            .eq("patient_id", patient_id) \
            .eq("caregiver_id", caregiver_id) \
            .execute()

        if not existing_link.data:
            supabase.table("patient_caregiver").insert({
                "patient_id": patient_id,
                "caregiver_id": caregiver_id,
                "linked_at": datetime.now(timezone.utc).isoformat(),
            }).execute()

        return {
            "status": "completed",
            "message": "Invitation accepted and caregiver linked to patient.",
            "caregiver_id": caregiver_id,
            "patient_id": patient_id,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
# Handle Pending invite for logged in caregiver
@router.get("/pending")
async def get_pending_invitations(email: str = Query(...)):
    """
    Fetch all pending invitations for a caregiver who just signed in.
    """
    try:
        result = supabase.table("invitations") \
            .select("token, patient_id, status, expires_at") \
            .eq("caregiver_email", email) \
            .eq("status", "pending") \
            .execute()

        if not result.data:
            return {
                "status": "none",
                "message": "No pending invitations."
            }

        # Get all valid (non-expired) invites
        pending_invites = []
        for invite in result.data:
            expires_at = datetime.fromisoformat(invite["expires_at"])
            if expires_at < datetime.now(timezone.utc):
                continue

            patient = supabase.table("users") \
                .select("full_name") \
                .eq("id", invite["patient_id"]) \
                .execute()

            patient_name = patient.data[0]["full_name"] if patient.data else None

            pending_invites.append({
                "token": invite["token"],
                "patient_name": patient_name,
                "patient_id": invite["patient_id"],
                "expires_at": invite["expires_at"]
            })

        if not pending_invites:
            return {
                "status": "none",
                "message": "All invitations expired."
            }

        return {
            "status": "pending",
            "count": len(pending_invites),
            "invitations": pending_invites
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
