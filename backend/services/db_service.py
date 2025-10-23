import os
from supabase import create_client, Client
from typing import List, Optional, Dict, Any

def get_supabase_client() -> Client:
    SUPABASE_URL=os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY=os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async def fetch_visit_transcript(visit_id: str, patient_id: str) -> Optional[Dict[str, Any]]:
    """Fetch transcript text for a specific visit."""
    supabase = get_supabase_client()

    response = (
        supabase.table("visits")
        .select(
            "doctor, visit_date, transcript_id, "
            "visit_transcripts(transcript_text, audio_url)"
        )
        .eq("visit_id", visit_id)
        .eq("patient_id", patient_id)
        .single()
        .execute()
    )

    data = response.data

    if data and data.get("visit_transcripts"):
        transcript = data["visit_transcripts"]
        return {
            "doctor": data.get("doctor"),
            "visit_date": data.get("visit_date"),
            "transcript_id": data.get("transcript_id"),
            "transcript_text": transcript.get("transcript_text"),
            "audio_url": transcript.get("audio_url"),
        }

    return None


async def fetch_visit_summary(visit_id: str, patient_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a single visit summary with its transcript."""
    supabase = get_supabase_client()

    response = (
        supabase.table("visit_summaries")
        .select(
            "*, visit_transcripts(transcript_text, audio_url)"
        )
        .eq("visit_id", visit_id)
        .eq("patient_id", patient_id)
        .single()
        .execute()
    )

    return response.data if response.data else None


async def fetch_all_visit_summaries(patient_id: str) -> List[Dict[str, Any]]:
    """Fetch all summaries for a patient (no transcript)."""
    supabase = get_supabase_client()

    response = (
        supabase.table("visit_summaries")
        .select("*, visits(doctor, visit_date)")
        .eq("patient_id", patient_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data or []


async def insert_visit_summary(
visit_id: str,
    patient_id: str,
    transcript_id: str,
    summary_data: dict
) -> Optional[Dict[str, Any]]:

    supabase = get_supabase_client()

    data = {
        "visit_id": visit_id,
        "patient_id": patient_id,
        "transcript_id": transcript_id,
        "summary": summary_data.get("summary"),
        "action_items": summary_data.get("action_items", []),
        "questions_next_visit": summary_data.get("questions_next_visit", []),
        "key_diagnoses": summary_data.get("key_diagnoses", []),
        "medications": summary_data.get("medications", []),
    }

    response = supabase.table("visit_summaries").insert(data).execute()
    return response.data if response.data else None

async def log_ai_usage(data: Dict):    
    supabase = get_supabase_client()
    supabase.table("ai_usage").insert(data).execute()

