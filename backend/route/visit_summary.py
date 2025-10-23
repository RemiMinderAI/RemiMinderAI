from fastapi import APIRouter, HTTPException
from models.schemas import VisitSummary, VisitSummaryPayload
from services.db_service import (
    fetch_visit_transcript,
    fetch_visit_summary,
    insert_visit_summary,
    fetch_all_visit_summaries,
)
from services.ai_service import summarize_visit
from datetime import datetime, timezone
from typing import List

router = APIRouter(prefix="/api", tags=["Visit Summaries"])

@router.post("/generate-summary/{visit_id}", response_model=VisitSummaryPayload)
async def create_visit_summary(visit_id: int, patient_id: int):
        
    visit = await fetch_visit_transcript(visit_id, patient_id)
    if not visit or not visit.get("transcript"):
        raise HTTPException(status_code=404, detail="Transcript not found")
    
    ai_output = await summarize_visit({"transcript": visit["transcript_text"]})
    
    await insert_visit_summary(visit_id, patient_id, ai_output)
    
    return {
        "message": "Summary generated successfully",
        "data": {
            "visit_id": visit_id,
            "patient_id": patient_id,
            **ai_output,
        }
    }

@router.get("/visit-summaries/{visit_id}", response_model=VisitSummary)
async def get_visit_summary(visit_id: int, patient_id: int):
    """Get single visit summary"""
    row = await fetch_visit_summary(visit_id, patient_id)
    if not row:
        raise HTTPException(status_code=404, detail="Summary not found")
    return row

@router.get("/visit-summaries", response_model=List[VisitSummary])
async def get_all_summaries(patient_id: int):
    """Get all summaries for patient (for Visit History page)"""
    summaries = await fetch_all_visit_summaries(patient_id)
    return summaries
