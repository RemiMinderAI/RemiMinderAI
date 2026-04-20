from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import cast, Dict
from main_backend.services.supabase_client import supabase
from main_backend.utils.auth import get_current_user

router = APIRouter(prefix="/api/linked", tags=["Caregiver-Patient Linkage"])

@router.get("/patients", status_code=status.HTTP_200_OK)
async def get_linked_patients(email: str = Query(..., description="Caregiver's email")):
    """
    Get all patients linked to a given caregiver.
    Steps:
    1. Look up caregiver_id by email
    2. Fetch patient_ids from patient_caregiver table
    3. Retrieve patient names from users table
    4. Return list of linked patients
    """
    try:
        # 1️ Get caregiver_id
        caregiver_res = supabase.table("caregivers").select("id").eq("email", email).execute()
        caregiver = caregiver_res.data[0] if caregiver_res.data else None

        if not caregiver:
            raise HTTPException(status_code=404, detail="Caregiver not found.")

        caregiver_id = caregiver["id"] # type: ignore

        # 2️ Get linked patient_ids
        link_res = supabase.table("patient_caregiver").select("patient_id").eq("caregiver_id", caregiver_id).execute()
        linked_patients = link_res.data

        if not linked_patients:
            return {
                "caregiver_email": email,
                "linked_patients": []
            }

        patient_ids = [p["patient_id"] for p in linked_patients] # type: ignore

        # 3️ Get patient details
        patients_res = supabase.table("users").select("id, full_name").in_("id", patient_ids).execute()
        patients = patients_res.data if patients_res.data else []

        # 4️ Format response
        return {
            "caregiver_email": email,
            "linked_patients": [
                {"patient_id": p["id"], "patient_name": p["full_name"]} # type: ignore
                for p in patients
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    

@router.get("/caregiver", status_code=status.HTTP_200_OK)
async def get_linked_caregiver(current_user=Depends(get_current_user)):
    """
    Fetch the linked caregiver for the logged-in patient.
    Steps:
    1. Extract patient auth_uid from JWT
    2. Find patient_id from 'users' table
    3. Find linked caregiver_id from 'patient_caregiver' table
    4. Fetch caregiver info (name, email, phone)
    """

    # 1️ Get patient from JWT
    auth_uid = current_user["sub"]

    # 2️ Lookup patient_id from users table
    patient_res = supabase.table("users").select("id, full_name").eq("auth_uid", auth_uid).execute()
    if not patient_res.data:
        raise HTTPException(status_code=403, detail="Patient record not found or unauthorized.")
    
    patient_id = patient_res.data[0]["id"] # type: ignore
    patient_name = patient_res.data[0]["full_name"] # type: ignore

    # 3️ Find caregiver link
    link_res = supabase.table("patient_caregiver").select("caregiver_id").eq("patient_id", patient_id).execute()
    if not link_res.data:
        return {
            "patient_name": patient_name,
            "caregiver": None,
            "message": "No caregiver linked yet."
        }

    caregiver_id = link_res.data[0]["caregiver_id"] # type: ignore

    # 4️ Fetch caregiver details
    caregiver_res = supabase.table("caregivers").select("id, full_name, email, phone").eq("id", caregiver_id).execute()
    if not caregiver_res.data:
        raise HTTPException(status_code=404, detail="Linked caregiver record not found.")
    
    caregiver = caregiver_res.data[0]

    # 5️⃣ Return response
    return {
        "patient_name": patient_name,
        "caregiver": {
            "id": caregiver["id"], # type: ignore
            "full_name": caregiver["full_name"] # type: ignore
        },
        "message": "Linked caregiver fetched successfully."
    }
