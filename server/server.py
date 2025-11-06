#server\server.py
import uvicorn
import shutil
import os
import platform
import logging

from typing import List, Optional, Dict, Any

from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

from backend.services.db_service import insert_visit_transcript, insert_initial_visit, update_transcript_visit_id
from backend.routes import visit_summary
from backend.routes.product_demo import demo_router
from backend.routes.visit_summary import create_visit_summary

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Detect operating system and set device
system = platform.system()
device = -1  # Default to CPU

if system == "Darwin":  # macOS
    device = "mps" if hasattr(os, 'uname') else -1  # Use MPS if available
elif system == "Linux":
    device = -1  # CPU (could add CUDA check)
elif system == "Windows":
    device = -1  # CPU

print(f"Running on {system}, using device: {device}")

# Create ASR pipeline using pre-trained Whisper model
asr_pipeline = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-base.en",
    device=device
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles application startup (e.g., verifying services) and shutdown."""
    logger.info("RemiMinder API starting up...")
    
    # === STARTUP LOGIC (Verifying SES configuration) ===
    try:
        from backend.services.notification_service import verify_email_configuration
        ses_ok = await verify_email_configuration()
        if ses_ok:
            logger.info("AWS SES configured and verified")
        else:
            logger.warning("AWS SES not properly configured")
            
    except Exception as e:
        logger.warning(f"Could not verify SES: {str(e)}")

    yield # API begins accepting requests here
    
    # === SHUTDOWN LOGIC ===
    logger.info("RemeMinder API shutting down.")


app = FastAPI(
    title="RemeMinder Unified API",
    description="Backend for recording, visit summaries, reminders, and AI processing",
    version="1.0.0",
    lifespan=lifespan # Attach the startup/shutdown logic
)

# (Keep your CORS middleware setup exactly as it is)
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-audio/")
async def create_upload_file(file: UploadFile = File(...), user_id: Optional[str] = None):
    # local_file_path = "DoctorPatientRecord.wav"
    user_id ="9957ecad-f983-4211-a1e1-41a67b0a0621"

    try:
        # Save the uploaded file temporarily
        # with open(local_file_path, "wb") as buffer:
        #     shutil.copyfileobj(file.file, buffer)
        
        # --- TRANSCRIPTION STEP using local Whisper pipeline ---
        try:
            # Transcribe the audio file using the local pipeline
            # result = asr_pipeline(local_file_path)
            # transcription = result['text']

            # transcription = """
            # [Doctor Chen]
            # Hi Lisa, I understand you've been having some knee pain.
            # Can you tell me when it started and what makes it worse?

            # [Lisa]
            # Yes, it started about two weeks ago.
            # It hurts most when I climb stairs or get up from a chair.

            # [Doctor Chen]
            # That sounds like mild inflammation, possibly early arthritis or overuse.
            # Does it swell or feel warm after activity?

            # [Lisa]
            # A little bit, yes — and it feels stiff in the mornings.

            # [Doctor Chen]
            # Alright. I recommend taking an anti-inflammatory like ibuprofen,
            # using a knee brace when you're walking,
            # and avoiding stairs when possible.
            # Apply ice twice a day for 15 minutes.
            # If it doesn't improve in a week, we'll schedule an X-ray.

            # [Lisa]
            # Okay, thank you doctor — I'll try that.

            # [Doctor Chen]
            # You're welcome, Lisa. Take care and rest that knee.
            # """

            transcription = """
            [Dr. Libby]
            Hi Lisa, I see your blood pressure readings from the last two weeks have improved quite a bit — now around 118 over 78.
            How have you been feeling?

            [Niall]
            Pretty good, actually. I've been eating better and walking every morning.
            I was wondering, do I still need to keep taking my medication?

            [Dr. Libby]
            That's great to hear, and I'm glad the numbers are down.
            For now, keep taking your current dose of lisinopril until we review your next lab results.
            If your pressure stays stable for another month, we can discuss lowering the dose.

            [Niall]
            Okay, so I'll continue the same tablets for now?

            [Dr. Libby]
            Yes, exactly — one tablet daily, same time each day.
            Keep tracking your readings twice a week and bring them to our next visit.

            [Niall]
            Got it. Thank you, Doctor.
            """
        except Exception as transcribe_error:
            raise Exception(f"Transcription failed: {transcribe_error}")
        # ----------------------------------------------------
        
        # Clean up the temporary audio file
        # os.remove(local_file_path)

        transcript_record = await insert_visit_transcript(transcription)
        if not transcript_record:
             raise HTTPException(status_code=500, detail="Failed to save transcript.")

        transcript_id = transcript_record['transcript_id']

        visit_record = await insert_initial_visit(user_id, transcript_record['transcript_id'])
        if not visit_record:
             raise HTTPException(status_code=500, detail="Failed to create visit record.")

        visit_id = visit_record['id']

        await update_transcript_visit_id(transcript_id, visit_id, user_id)

        summary_result = await create_visit_summary(
            visit_id=visit_record['id'],
            user_id=user_id,
            transcript_id=transcript_record["transcript_id"]
        ) 
        
        return {
            "message": "Visit processed and summarized successfully!",
            "visit_id": visit_record['id'],
            "summary": summary_result['data']['summary']
        }
        
    except Exception as e:
        logger.error(f"Error during full visit processing: {e}")
        # Ensure cleanup even on errors
        # if os.path.exists(local_file_path):
        #     os.remove(local_file_path)
        return {"message": f"There was an error processing the audio: {e}"} 
    finally:
        # Ensure the uploaded file object is closed
        if file and not file.file.closed:
             file.file.close()

# (Keep your @app.get("/") and if __name__ == "__main__": blocks)
@app.get("/")
def read_root():
    return {"message": "MediMinder FastAPI server is running", "status": "running"}

@app.get("/health")
async def health():
    return {"status":"healthy"}

app.include_router(visit_summary.router)
app.include_router(demo_router)
# app.include_router(reminders.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
