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

from main_backend.services.db_service import insert_visit_transcript, insert_initial_visit, update_transcript_visit_id, insert_visit_summary
from main_backend.services.ai_service import generate_ai_summary
from main_backend.route import visit_summary, reminders
from main_backend.route.product_demo import demo_router
from utils import get_current_user
from fastapi import Depends

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
async def create_upload_file(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    local_file_path = f"./{file.filename}"

    try:
        # Get auth_uid from auth
        auth_uid = current_user["sub"]

        # Get actual user_id from users table
        from backend.services.db_service import get_supabase_client
        supabase = get_supabase_client()
        user_res = supabase.table("users").select("id").eq("auth_uid", auth_uid).execute()
        if not user_res.data:
            raise HTTPException(status_code=404, detail="User not found in database")
        user_id = user_res.data[0]["id"]

        # Save the uploaded file temporarily
        with open(local_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # --- TRANSCRIPTION STEP using local Whisper pipeline ---
        try:
            # Transcribe the audio file using the local pipeline
            result = asr_pipeline(local_file_path)
            transcription = result['text']

        except Exception as transcribe_error:
            raise Exception(f"Transcription failed: {transcribe_error}")
        # ----------------------------------------------------

        # --- STORE TRANSCRIPT IN SUPABASE ---
        try:
            transcript_record = await insert_visit_transcript(transcription)
            if transcript_record:
                transcript_id = transcript_record['transcript_id']
                print("Inserted transcript:", transcript_record)

                # Create initial visit
                visit_record = await insert_initial_visit(user_id, transcript_id)
                if visit_record:
                    visit_id = visit_record['id']
                    print("Created visit:", visit_record)

                    # Update transcript with visit_id and user_id
                    await update_transcript_visit_id(transcript_id, visit_id, user_id)
                    print("Updated transcript with visit and user IDs")

                    # Generate AI summary
                    ai_output = await generate_ai_summary({
                        "transcript": transcription,
                        "visit_id": visit_id,
                        "user_id": user_id,
                        "transcript_id": transcript_id
                    })
                    print("Generated AI summary:", ai_output)

                    # Insert visit summary
                    await insert_visit_summary(visit_id, user_id, transcript_id, ai_output)
                    print("Inserted visit summary")

                else:
                    print("Failed to create visit")
            else:
                print("Failed to insert transcript")
        except Exception as db_error:
            print(f"Database insert failed: {db_error}")
        # ----------------------------------------------------

        # Clean up the temporary audio file
        os.remove(local_file_path)

        return {
            "message": "Transcription and summary generation successful!",
            "transcription": transcription
        }

    except Exception as e:
        # Ensure cleanup even on errors
        if os.path.exists(local_file_path):
            os.remove(local_file_path)
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
app.include_router(reminders.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
