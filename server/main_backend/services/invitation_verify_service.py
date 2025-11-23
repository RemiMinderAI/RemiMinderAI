from datetime import datetime, timezone
from supabase_client import supabase

async def verify_invitation_token(token: str):
    """
    Verifies an invitation token against the database.
    Returns invitation data if valid, otherwise None.
    """
    # 1. Fetch invitation by token, Returns None if the token doesn’t exist.
    result = supabase.table("invitations").select("*").eq("token", token).execute()
    if not result.data:
        return None

    invitation = result.data[0]

    # 2. Check expiry
    # Converts the ISO string from Supabase to a datetime.
    # Returns None if the token is expired.
    expires_at = datetime.fromisoformat(invitation["expires_at"]) 
    if expires_at < datetime.now(timezone.utc):
        return None

    # 3. Check status (must be pending)
    # Ensures the invitation hasn’t already been accepted.
    if invitation["status"] != "pending":
        return None

    # 4. Get associated patient info for prefill
    # Pulls the patient’s name for pre-filling the invitation page.
    patient = supabase.table("users").select("id, full_name").eq("id", invitation["patient_id"]).execute()
    patient_name = patient.data[0]["full_name"] if patient.data else None 

    return {
        "patient_id": invitation["patient_id"],
        "patient_name": patient_name,
        "caregiver_email": invitation["caregiver_email"],
        "status": invitation["status"],
        "expires_at": invitation["expires_at"]
    }
