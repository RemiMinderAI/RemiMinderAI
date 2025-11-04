import os
from supabase import create_client, Client
from typing import List, Optional, Dict, Any

def get_supabase_client() -> Client:
    SUPABASE_URL=os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY=os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async def fetch_visit_transcript(visit_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """Fetch transcript text for a specific visit."""
    supabase = get_supabase_client()

    response = (
        supabase.table("visits")
        .select(
            "doctor, transcript_id,title, status, specialty, "
            "visit_transcripts(transcript_text, audio_url)"
        )
        .eq("id", visit_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    data = response.data

    if data and data.get("visit_transcripts"):
        transcript = data["visit_transcripts"]
        return {
            "doctor": data.get("doctor"),
            "transcript_id": data.get("transcript_id"),
            "transcript_text": transcript.get("transcript_text"),
            "audio_url": transcript.get("audio_url"),
        }

    return None


async def fetch_visit_summary(visit_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a single visit summary with its transcript."""
    supabase = get_supabase_client()

    response = (
        supabase.table("visit_summaries")
        .select(
            "*, visit_transcripts(transcript_text, audio_url)"
        )
        .eq("visit_id", visit_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    return response.data if response.data else None


async def fetch_all_visit_summaries(user_id: str) -> List[Dict[str, Any]]:
    """Fetch all summaries for a patient (no transcript)."""
    supabase = get_supabase_client()

    response = (
        supabase.table("visit_summaries")
        .select("*, visits(title, status, doctor, specialty, duration)")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data or []

def _list_to_comma_separated(data_list: list) -> str:
    if isinstance(data_list, tuple):
        data_list = data_list[0] if data_list else []
    
    if not isinstance(data_list, list) or not data_list:
        return ""
        
    return ", ".join(data_list)

async def insert_visit_summary(
    visit_id: str,
    user_id: str,
    transcript_id: str,
    summary_data: dict
) -> Optional[Dict[str, Any]]:

    supabase = get_supabase_client()

    data = {
        "visit_id": visit_id,
        "user_id": user_id,
        "transcript_id": transcript_id,
        "summary": summary_data.get("summary"),
        "action_items": _list_to_comma_separated(summary_data.get("action_items", [])),
        "questions_next_visit": _list_to_comma_separated(summary_data.get("questions_next_visit", [])),
        "key_diagnoses": _list_to_comma_separated(summary_data.get("key_diagnoses", [])),
        "medications": _list_to_comma_separated(summary_data.get("medications", [])),
    }

    response = supabase.table("visit_summaries").insert(data).execute()
    return response.data if response.data else None


async def insert_visit_transcript(transcript_text: str) -> Optional[Dict[str, Any]]:
    """Inserts a new transcript and returns its ID."""
    supabase = get_supabase_client()
    response = supabase.table("visit_transcripts").insert({"transcript_text": transcript_text}).execute()
    return response.data[0] if response.data else None

async def insert_initial_visit(user_id: str, transcript_id: str) -> Optional[Dict[str, Any]]:
    """Creates the initial visit record."""
    supabase = get_supabase_client()
    data = {
        "user_id": user_id,
        "transcript_id": transcript_id,
        "title": "New Recorded Visit",
        "status": "pending",
        "doctor": "TBD",
        "specialty": "TBD",
    }
    response = supabase.table("visits").insert(data).execute()
    return response.data[0] if response.data else None

async def update_transcript_visit_id(transcript_id: str, visit_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    """
    Updates the visit_transcripts record to link it to a specific visit_id.
    """
    supabase = get_supabase_client()
    try:
        response = (
            supabase.table("visit_transcripts")
            .update({"visit_id": visit_id, "user_id": user_id})
            .eq("transcript_id", transcript_id)
            .execute()
        )
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error updating transcript visit_id: {e}")
        return None


#-------------------------------------------------------------#
# AI
#-------------------------------------------------------------#
async def log_ai_usage(data: Dict):    
    supabase = get_supabase_client()
    supabase.table("ai_usage").insert(data).execute()



#-------------------------------------------------------------#
# REMINDERS
#-------------------------------------------------------------#
def get_prompt_text_supabase(category: str, limit: int = 2):
    supabase = get_supabase_client()
    examples = []
    
    try:
        prompt_bank_data = (supabase.table("prompt_bank")
                         .select("prompt_text, example_input, example_output")
                         .eq("prompt_category", category)
                         .order("rating", desc=True)
                         .order("created_at", desc=True)
                         .limit(1)
                         .execute()).data
        
        base_prompt = ""
        if prompt_bank_data:
            base_prompt_entry = prompt_bank_data[0]
            base_prompt = base_prompt_entry['prompt_text']
            base_prompt_entry['source_table'] = 'prompt_bank'
            examples.append(base_prompt_entry)

        if len(examples) < limit:
            best_examples_data = (supabase.table("best_examples")
                             .select("example_input, example_output")
                             .eq("category", category)
                             .order("created_at", desc=True)
                             .limit(1)
                             .execute()).data
            
            if best_examples_data:
                best_example = best_examples_data[0]
                best_example['source_table'] = 'best_examples'
                
                if not examples or best_example['example_input'] != examples[0]['example_input']:
                    examples.append(best_example)

    except Exception as e:
        print(f"Warning: Error fetching prompt bank - {e}")
        base_prompt = ""
    
    return base_prompt, examples

