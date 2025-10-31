from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from route import visit_summary, reminders
from dotenv import load_dotenv

import logging
from contextlib import asynccontextmanager

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown events using asynccontextmanager.
    The code before 'yield' runs on startup.
    The code after 'yield' runs on shutdown.
    """
    logger.info("RemiMinder API starting up...")
    logger.info("Reminder routes loaded")
    
    # === STARTUP LOGIC ===
    try:
        # Import moved inside lifespan to prevent circular imports during startup
        from services.notification_service import verify_email_configuration
        
        # Verify SES configuration (your original startup logic)
        ses_ok = await verify_email_configuration()
        if ses_ok:
            logger.info("✅ AWS SES configured and verified")
        else:
            logger.warning("⚠️ AWS SES not properly configured")
            
    except Exception as e:
        logger.warning(f"❌ Could not verify SES: {str(e)}")

    # Execution continues inside the application (i.e., API begins accepting requests)
    yield
    
    # === SHUTDOWN LOGIC (Add any cleanup here) ===
    logger.info("RemeMinder API shutting down.")

app = FastAPI(
    title="RemeMinder API",
    description="Backend for visit summaries, reminders and AI processing",
    version="1.0.0",
    lifespan=lifespan
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS - Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "https://xxx.com"  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(visit_summary.router)
app.include_router(reminders.router)

@app.get("/")
async def root():
    return {"message": "RemeMinder API", "status": "running"}

@app.get("/health")
async def health():
    return {"status":"healthy"}

