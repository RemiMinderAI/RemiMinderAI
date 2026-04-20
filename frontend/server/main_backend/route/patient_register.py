from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, timezone, date
import uuid
from typing import cast, Dict
from main_backend.services.supabase_client import supabase
from main_backend.utils.auth import get_current_user

router = APIRouter(prefix="/api/patient")

# Request body
class PatientRegister(BaseModel):
    full_name: str
    date_of_birth: date  # YYYY-MM-DD
    gender: str
    phone_number: str
    email: str
    notes: str | None = None

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_patient(
    request: PatientRegister,
    current_user: dict = Depends(get_current_user)
):
    """
    Registers a patient in the 'users' table.
    current_user comes from JWT verification.
    which decode the JWT and return information about the logged-in patient
    including their Supabase UID (sub or user_id) and email.
    """
    auth_uid = current_user["sub"]
    jwt_email = current_user.get("email")

    # 1️ Optional check: make sure email in payload matches email in JWT
    if not jwt_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not found in JWT token."
        )

    if jwt_email.lower() != request.email.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email does not match authenticated user"
        )

    # 2️ Check if patient already exists
    existing = supabase.table("users").select("*").eq("auth_uid", auth_uid).execute()
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Patient already registered"
        )

    # 3️ Insert patient
    insert_res = supabase.table("users").insert({
        "auth_uid": auth_uid,
        "full_name": request.full_name,
        "date_of_birth": request.date_of_birth.isoformat() if isinstance(request.date_of_birth, date) else request.date_of_birth,
        "gender": request.gender,
        "phone": request.phone_number,
        "email": request.email,
        "notes": request.notes,
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).execute() # type: ignore

    if not insert_res.data:
        raise HTTPException(status_code=500, detail="Failed to register patient")

    patient = insert_res.data[0]

    return {
        "status": "created",
        "message": "Patient registered successfully",
        "patient": patient
    }
