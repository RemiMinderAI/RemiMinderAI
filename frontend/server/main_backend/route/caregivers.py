from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, timezone
from typing import cast, Dict
from main_backend.services.supabase_client import supabase

router = APIRouter(prefix="/api/caregivers", tags=["Caregivers"]) 

@router.get("/check")
async def check_caregiver_exists(email: str = Query(..., description="Caregiver email to check")):
    """
    Check if caregiver already exists in database (by email).
    Used at signup to decide whether to redirect to dashboard or registration.
    """
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    caregiver = supabase.table("caregivers").select("id, full_name, email").eq("email", email).execute()

    if caregiver.data:
        return {
            "exists": True,
            "caregiver": caregiver.data[0],
            "message": "Caregiver already registered. Redirect to dashboard."
        }

    return {
        "exists": False,
        "message": "No caregiver found. Proceed to registration."
    }

# Request model
class CaregiverRegisterRequest(BaseModel):
    full_name: str
    phone_number: str
    email: EmailStr
    notes: str | None = None

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_caregiver(request: CaregiverRegisterRequest):
    """
    Register a caregiver directly (without invitation).
    Creates a new caregiver record if email not already in use in caregiver table.
    """
    email = request.email

    # 1️ Check if caregiver already exists
    existing = supabase.table("caregivers").select("id").eq("email", email).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Caregiver with this email already exists."
        )

    # 2️ Insert new caregiver
    insert_res = supabase.table("caregivers").insert({
        "full_name": request.full_name,
        "phone": request.phone_number,
        "email": email,
        "notes": request.notes,
        "created_at": datetime.now(timezone.utc).isoformat()
    }).execute()

    if not insert_res.data:
        raise HTTPException(status_code=500, detail="Failed to register caregiver.")

    caregiver_id = insert_res.data[0]["id"] # type: ignore

    return {
        "status": "registered",
        "message": "Caregiver registered successfully.",
        "caregiver_id": caregiver_id
    }
