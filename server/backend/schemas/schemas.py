#backend\schemas\schemas.py
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Any
from uuid import UUID

# -------------------------------
# Visit Summary (AI-generated)
# -------------------------------
class VisitSummary(BaseModel):
    visit_id: UUID                               # FK to visits.id
    transcript_id: UUID           # FK to visit_transcripts.transcript_id
    user_id: UUID                                # Used for RLS
    summary: str
    action_items: Optional[List[str]] = Field(default_factory=list)
    questions_next_visit: Optional[List[str]] = Field(default_factory=list)
    key_diagnoses: Optional[List[str]] = Field(default_factory=list)
    medications: Optional[List[str]] = Field(default_factory=list)
    created_at: Optional[datetime] = None


class VisitSummaryPayload(BaseModel):
    message: str
    data: VisitSummary


# -------------------------------
# Visit (Master Consultation Record)
# -------------------------------
class Visit(BaseModel):
    user_id: UUID
    transcript_id: Optional[UUID] = None
    title: Optional[str] = None
    status: Optional[str] = None
    doctor: Optional[str] = None
    specialty: Optional[str] = None
    duration: Optional[str] = None
    created_at: Optional[datetime] = None


# -------------------------------
# Visit Transcript (Raw Text + Audio)
# -------------------------------
class VisitTranscript(BaseModel):
    transcript_id: Optional[UUID] = None
    visit_id: Optional[UUID] = None
    user_id: UUID
    audio_url: Optional[str] = None
    transcript_text: Optional[str] = None
    created_at: Optional[datetime] = None


# -------------------------------
# AI Usage (Token Tracking)
# -------------------------------
class AIUsage(BaseModel):
    timestamp: Optional[datetime] = None
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    total_cost: Optional[float] = None
    visit_id: Optional[UUID] = None
    transcript_id: Optional[UUID] = None
    user_id: Optional[UUID] = None
