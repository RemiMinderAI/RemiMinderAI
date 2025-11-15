from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Literal
from uuid import UUID

# ============================================================================
# REQUEST SCHEMAS
# ============================================================================
class ReminderCreate(BaseModel):
    user_id: UUID
    visit_id: Optional[UUID] = None
    reminder_type: Literal["medication", "task", "appointment"]
    title: str
    scheduled_time: datetime
    timezone: str = "America/New_York"
    recurrence: Literal["daily", "weekly", "once"] = "once"
    context_data: Optional[dict] = None  # For AI: {medication_list: [...], task_type: "bp_check"}

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    timezone: Optional[str] = None
    recurrence: Optional[str] = None
    status: Optional[Literal["pending", "completed", "snoozed", "skipped"]] = None

class ReminderAction(BaseModel):
    notes: Optional[str] = None  # Optional patient notes for logs

# ============================================================================
# RESPONSE SCHEMAS
# ============================================================================

class ReminderResponse(BaseModel):
    id: UUID
    user_id: UUID
    visit_id: Optional[UUID]
    
    title: str
    reminder_type: str
    message: str  # AI-generated friendly text
    
    # Scheduling
    scheduled_time: datetime
    timezone: str
    recurrence: Optional[str]
    
    # Status
    status: str
    display_status: str  # Computed: "Due Now", "Upcoming", "Completed"
    completed_at: Optional[datetime]
    
    # Interaction
    snoozed_count: int
    snooze_until: Optional[datetime]
    
    # Display helpers
    icon_type: Optional[str] = None,  # Derived from reminder_type
    display_time: str  # "8:15 PM"
    relative_time: str  # "in 2 hours"
    
    # Metadata
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReminderOverview(BaseModel):
    total: int
    active_today: int
    upcoming: int
    past: int

class ReminderListResponse(BaseModel):
    overview: ReminderOverview
    today: List[ReminderResponse]
    upcoming: List[ReminderResponse]
    past: List[ReminderResponse]

class ReminderLogResponse(BaseModel):
    id: str
    reminder_id: str
    user_id: str
    action: str
    timestamp: datetime
    notes: Optional[str]

    class Config:
        from_attributes = True


# ============================================================================
# CAREGIVER SCHEMAS
# ============================================================================

class CaregiverAlertResponse(BaseModel):
    id: str
    caregiver_id: str
    user_id: str
    reminder_id: str
    alert_type: str
    message: str
    sent_at: datetime
    read: bool

    class Config:
        from_attributes = True


class NextReminderSummary(BaseModel):
    id: str
    title: str
    scheduled_time: datetime
    reminder_type: str
    status: str


class RecentActivitySummary(BaseModel):
    reminder_id: str
    title: str
    action: str
    timestamp: datetime

class AlertsSummary(BaseModel):
    missed_today: int
    snoozed_multiple: int
    unread_alerts: int

class CaregiverDashboardResponse(BaseModel):
    user_id: str
    patient_name: str
    next_reminders: List[NextReminderSummary]
    recent_activity: List[RecentActivitySummary]
    alerts_summary: AlertsSummary  # {missed_today: 2, snoozed_multiple: 1, unread_alerts: 3}

