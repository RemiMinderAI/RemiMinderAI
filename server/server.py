import uvicorn
import shutil
import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline

# Create ASR pipeline using pre-trained Whisper model
asr_pipeline = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-base.en",
    device="mps" if os.uname().sysname == "Darwin" else -1  # Use MPS on Mac, CPU elsewhere
)

app = FastAPI()

# (Keep your CORS middleware setup exactly as it is)
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-audio/")
async def create_upload_file(file: UploadFile = File(...)):
    local_file_path = f"./{file.filename}"

    try:
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
        
        # Clean up the temporary audio file
        os.remove(local_file_path)

        return {
            "message": "Transcription successful!",
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
    return {"message": "MediMinder FastAPI server is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
