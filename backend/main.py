from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from route import visit_summary
from dotenv import load_dotenv

import logging

load_dotenv()

app = FastAPI(
    title="RemeMinder API",
    description="Backend for visit summaries, reminders and AI processing",
    version="1.0.0"
)

logging.basicConfig(level=logging.INFO)

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

@app.get("/")
async def root():
    return {"message": "RemeMinder API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
