from pydantic import BaseModel
from datetime import datetime
from typing import List

class VisitSummary(BaseModel):
    visit_id: int
    patient_id: int
    summary: str
    action_items: List[str]
    questions_next_visit: List[str]
    created_at: datetime

class VisitSummaryPayload(BaseModel):
    message: str
    data: VisitSummary

