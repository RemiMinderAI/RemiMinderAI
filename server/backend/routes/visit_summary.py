#backend\routes\visit_summary.py
from fastapi import APIRouter, HTTPException
from backend.schemas.schemas import VisitSummary, VisitSummaryPayload
from backend.services.db_service import (
    fetch_visit_transcript,
    fetch_visit_summary,
    insert_visit_summary,
    fetch_all_visit_summaries,
)
from backend.services.ai_service import summarize_visit
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

router = APIRouter(prefix="/api", tags=["Visit Summaries"])

@router.post("/generate-summary/{visit_id}", response_model=VisitSummaryPayload)
async def create_visit_summary(visit_id: str, user_id: str, transcript_id: str):

    visit = await fetch_visit_transcript(visit_id, user_id)
    if not visit or not visit.get("transcript_text"):
        raise HTTPException(status_code=404, detail="Transcript not found")
    
    ai_output = await summarize_visit({"transcript": visit["transcript_text"], "visit_id": visit_id, 
                                       "user_id": user_id, "transcript_id": visit["transcript_id"]})
    
    await insert_visit_summary(visit_id, user_id, visit["transcript_id"], ai_output)
    
    return {
        "message": "Summary generated successfully",
        "data": {
            "visit_id": visit_id,
            "user_id": user_id,
            **ai_output,
        }
    }

@router.get("/visit-summaries/{visit_id}", response_model=VisitSummary)
async def get_visit_summary(visit_id: int, user_id: int):
    """Get single visit summary"""
    row = await fetch_visit_summary(visit_id, user_id)
    if not row:
        raise HTTPException(status_code=404, detail="Summary not found")
    return row

@router.get("/visit-summaries", response_model=List[VisitSummary])
async def get_all_summaries(user_id: int):
    """Get all summaries for patient (for Visit History page)"""
    summaries = await fetch_all_visit_summaries(user_id)
    formatted_summaries = []
    for item in summaries:
        visit_data = item.get('visits', {}) 
        
        date_source = item.get('created_at')
        
        if not date_source:
            visit_dt = datetime.now() 
        else:
            visit_dt = datetime.fromisoformat(date_source.replace('Z', '+00:00')) 

        formatted_summaries.append({
            "id": item.get('visit_id'), 
            "title": visit_data.get('title', 'Untitled Visit'), 
            "status": visit_data.get('status', 'Completed'),
            "doctor": visit_data.get('doctor', 'N/A'),
            "specialty": visit_data.get('specialty', 'General'),
            "date": visit_dt.strftime("%b %d, %Y"),  # e.g., Oct 10, 2025
            "time": visit_dt.strftime("%I:%M %p"),   # e.g., 2:30 PM
            "duration": visit_data.get('duration', 'N/A'),
            "summary": item.get('summary', 'No summary available.'),
            # MAPPING: action_items (from DB) -> keyPoints (for Frontend)
            "keyPoints": item.get('action_items', []), 
        })
    
    return formatted_summaries
