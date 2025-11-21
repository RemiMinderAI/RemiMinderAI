from fastapi import APIRouter, HTTPException, status, Body, Depends
from typing import List, Optional
import logging

from main_backend.schemas.reminder_schemas import (
    ReminderCreate,
    ReminderUpdate,
    ReminderAction,
    ReminderResponse,
    ReminderListResponse,
    CaregiverAlertResponse,
    CaregiverDashboardResponse
)
from main_backend.services.reminder_service import (
    create_new_reminder,
    get_reminder_by_id,
    list_patient_reminders,
    update_reminder_details,
    cancel_reminder,
    complete_reminder,
    snooze_reminder,
    skip_reminder,
    get_caregiver_dashboard_data
)
from main_backend.services.db_reminders import (
    get_caregiver_alerts,
    mark_alert_as_read
)
from main_backend.services.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["reminders"])

@router.post("/reminders", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(data: ReminderCreate, user_id: str = Depends(get_current_user)):
    """
    Create a new reminder with AI-generated personalized message.
    """
    try:
        # associate with authenticated user
        data.user_id = user_id
        reminder = await create_new_reminder(data)
        
        if not reminder:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create reminder"
            )
        
        return reminder
        
    except Exception as e:
        logger.error(f"Error in create_reminder endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create reminder: {str(e)}"
        )

# Get user_id from JWT token instead of query param
@router.get("/reminders", response_model=ReminderListResponse)
async def get_patient_reminders(user_id: str = Depends(get_current_user)):
    """
    Get all reminders for a patient, organized by category (today, upcoming, past).
    """
    try:
        reminders = await list_patient_reminders(user_id)
        return reminders
        
    except Exception as e:
        logger.error(f"Error in get_patient_reminders: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reminders: {str(e)}"
        )

@router.get("/reminders/{reminder_id}", response_model=ReminderResponse)
async def get_reminder(reminder_id: str, user_id: str = Depends(get_current_user)):
    """
    Get a single reminder by ID.
    """
    try:
        reminder = await get_reminder_by_id(reminder_id, user_id)

        if not reminder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reminder not found"
            )
        
        return reminder

    except Exception as e:
        logger.error(f"Error in get_reminder: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reminder: {str(e)}"
        )


@router.put("/reminders/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(reminder_id: str, user_id: str = Depends(get_current_user), updates: ReminderUpdate = Body(...)):
    """
    Update a reminder (time, title, status, etc.).
    """
    try:
        reminder = await update_reminder_details(reminder_id, user_id, updates)

        if not reminder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reminder not found"
            )
        
        return reminder
    
    except Exception as e:
        logger.error(f"Error in update_reminder: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update reminder: {str(e)}"
        )


@router.delete("/reminders/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(reminder_id: str, user_id: str = Depends(get_current_user)):
    """
    Cancel/delete a reminder.
    """
    try:
        success = await cancel_reminder(reminder_id, user_id)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reminder not found"
            )
        
        return None
    
    except Exception as e:
        logger.error(f"Error in delete_reminder: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete reminder: {str(e)}"
        )


@router.post("/reminders/{reminder_id}/complete", response_model=ReminderResponse)
async def mark_complete(
    reminder_id: str, 
    user_id: str = Depends(get_current_user),
    action: ReminderAction = Body(default=ReminderAction())
):
    """
    Mark a reminder as completed.
    """
    try:
        reminder = await complete_reminder(reminder_id, user_id, action)
        
        if not reminder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reminder not found"
            )
        
        return reminder
    
    except Exception as e:
        logger.error(f"Error in mark_complete: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete reminder: {str(e)}"
        )

@router.post("/reminders/{reminder_id}/snooze", response_model=ReminderResponse)
async def snooze_reminder_post(
    reminder_id: str,
    user_id: str = Depends(get_current_user),
    snooze_minutes: int = 30
):
    """
    Snooze a reminder. The snooze count is incremented, and the scheduled time is pushed forward.
    """
    try:
        reminder = await snooze_reminder(reminder_id, user_id, snooze_minutes)
        
        if not reminder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cannot snooze: Reminder not found or is already completed/cancelled." 
            )
        
        return reminder
    
    except Exception as e:
        logger.error(f"Error in snooze_reminder: {str(e)}")
        raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Failed to snooze reminder: {str(e)}"
)

@router.post("/reminders/{reminder_id}/skip", response_model=ReminderResponse)
async def skip_reminder_post(
    reminder_id: str, 
    user_id: str = Depends(get_current_user),
    action: ReminderAction = Body(default=ReminderAction())
):
    
    """
    Skip a reminder with optional reason.
    """
    try:
        reminder = await skip_reminder(reminder_id, user_id, action)

        if not reminder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reminder not found"
            )
        
        return reminder

    except Exception as e:
        logger.error(f"Error in skip_reminder: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to skip reminder: {str(e)}"
        )


# ============================================================================
# CAREGIVER
# ============================================================================

@router.get("/caregivers/{caregiver_id}/activity", response_model=CaregiverDashboardResponse)
async def get_caregiver_activity(caregiver_id: str, user_id: str = Depends(get_current_user)):
    """
    Get aggregated activity data for caregiver dashboard.
    Shows next reminders, recent activity, and alert summary.
    """
    try:
        dashboard_data = await get_caregiver_dashboard_data(caregiver_id, user_id)
        return dashboard_data
    
    except Exception as e:
        logger.error(f"Error in get_caregiver_activity: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch caregiver activity: {str(e)}"
        )

@router.get("/caregivers/{caregiver_id}/alerts", response_model=List[CaregiverAlertResponse])
async def get_alerts(caregiver_id: str, unread_only: bool = False):
    """
    Get all alerts for a caregiver.
    """
    try:
        alerts = await get_caregiver_alerts(caregiver_id, unread_only)
        return alerts
        
    except Exception as e:
        logger.error(f"Error in get_alerts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch alerts: {str(e)}"
        )


@router.patch("/caregivers/alerts/{alert_id}/read", response_model=CaregiverAlertResponse)
async def mark_alert_read(alert_id: str, caregiver_id: str):
    """
    Mark a caregiver alert as read.
    """
    try:
        alert = await mark_alert_as_read(alert_id, caregiver_id)

        if not alert:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Alert not found"
            )
        
        return alert
    
    except Exception as e:
        logger.error(f"Error in mark_alert_read: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark alert as read: {str(e)}"
        )
