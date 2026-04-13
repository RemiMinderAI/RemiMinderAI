#server\server.py
import sys
import uvicorn
import shutil
import os
import logging

from openai import OpenAI
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from main_backend.services.db_service import insert_visit_transcript, insert_initial_visit, update_transcript_visit_id, insert_visit_summary
from main_backend.services.ai_service import generate_ai_summary
from main_backend.route import visit_summary, reminders
from main_backend.route.product_demo import demo_router
from main_backend.utils.auth import get_current_user
from reminder_scheduler import run_scheduler
from main_backend.route import invitations, patient_register, caregiver_patient, caregivers


# sys.path.append('../')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("RemiMinderAPI")

OPEN_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPEN_API_KEY)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles application startup (e.g., verifying services) and shutdown."""
    logger.info("RemiMinder API starting up...")
    
    # === STARTUP LOGIC (Verifying SES configuration) ===
    try:
        from main_backend.services.notification_service import verify_email_configuration
        ses_ok = await verify_email_configuration()
        if ses_ok:
            logger.info("AWS SES configured and verified")
        else:
            logger.warning("AWS SES not properly configured")
            
    except Exception as e:
        logger.warning(f"Could not verify SES: {str(e)}")

    yield # API begins accepting requests here
    
    # === SHUTDOWN LOGIC ===
    logger.info("RemiMinder API shutting down.")


app = FastAPI(
    title="RemiMinder Unified API",
    description="Backend for recording, visit summaries, reminders, and AI processing",
    version="1.0.0",
    lifespan=lifespan # Attach the startup/shutdown logic
)

# Allow Frontend URLs (Localhost + Vercel)
FRONTEND_URL = os.getenv("FRONTEND_URL", "") # e.g., https://remiminderai.vercel.app
REACT_APP_FRONTEND_URL = os.getenv("REACT_APP_FRONTEND_URL", "") # e.g., https://remiminderai.vercel.app

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173", # Vite default
    FRONTEND_URL,
    REACT_APP_FRONTEND_URL,
    "https://www.remiminderai.com", 
    "https://remiminderai.com"
]

# Remove empty strings if ENV is missing
origins = [o for o in origins if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"CORS allowed origins: {origins}")

# === CRON JOB ENDPOINT (SECURE) ===
@app.get("/api/cron/trigger-reminders")
async def trigger_reminders(
    background_tasks: BackgroundTasks,
    x_cron_secret: str = Header(None) # Read from Header, not Query Param
):
    """
    Triggered by cron-job.org every minute.
    Protected by a secret key in the header.
    """
    logger.info("Cron trigger received.")

    EXPECTED_SECRET = os.getenv("CRON_SECRET")
    
    # Security Check
    if not EXPECTED_SECRET:
        logger.error("CRON_SECRET not set on server.")
        raise HTTPException(status_code=500, detail="Server misconfiguration")

    if x_cron_secret != EXPECTED_SECRET:
        logger.warning(f"Unauthorized cron attempt. Received header: {x_cron_secret}")
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Run scheduler in background so endpoint returns immediately
    background_tasks.add_task(run_scheduler)
    
    return {"message": "Scheduler triggered successfully"}

# === AUDIO UPLOAD ENDPOINT ===

@app.post("/upload-audio/")
async def create_upload_file(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    #local_file_path = f"./{file.filename}"
    local_file_path = f"/tmp/{file.filename}"
    
    try:
        # Get auth_uid from auth
        auth_uid = current_user["sub"]

        # Get actual user_id from users table
        from main_backend.services.db_service import get_supabase_client
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
            with open(local_file_path, "rb") as audio_file:
                transcription = client.audio.transcriptions.create(
                    model="gpt-4o-transcribe",
                    file=audio_file,
                    response_format="text"
                )
                
        except Exception as transcribe_error:
            raise Exception(f"Transcription failed: {transcribe_error}")

        print("\nTRANSCRIPT:", transcription)
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

@app.get("/")
def read_root():
    return {"message": "RemiMinder Backend is Live", "status": "active"}

@app.get("/health")
async def health():
    return {"status":"healthy"}

# === API ROUTES ===
app.include_router(visit_summary.router)
app.include_router(demo_router)
app.include_router(reminders.router)

# route for caregiver invitation
app.include_router(invitations.router)
# route for patient registration
app.include_router(patient_register.router)
# route to display caregiver_patient linking
app.include_router(caregiver_patient.router)
#route to register caregiver (w/o invitation)
app.include_router(caregivers.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

