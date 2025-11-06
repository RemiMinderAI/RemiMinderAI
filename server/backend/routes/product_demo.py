from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.ai_service import generate_ai_summary 

class DemoTranscript(BaseModel):
    transcript_text: str

demo_router = APIRouter()

@demo_router.post("/api/demo-summary", tags=["Demo"])
async def get_demo_summary(demo_data: DemoTranscript):
    """
    Receives transcript text from the frontend demo and generates a summary.
    """
    summary_data = await generate_ai_summary(demo_data.transcript_text)
    return summary_data
