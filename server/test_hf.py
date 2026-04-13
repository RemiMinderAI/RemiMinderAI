import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")
MODEL_ID = "openai/whisper-base.en"

print("API Key loaded:", HF_API_KEY is not None)
print("Model:", MODEL_ID)

if not HF_API_KEY:
    print("HF_API_KEY not found")
    exit()

client = InferenceClient(token=HF_API_KEY)
print("Client initialized")

try:
    # Test with a sample audio URL or local file
    # For testing, let's use a sample
    url = "https://huggingface.co/datasets/Narsil/asr_dummy/resolve/main/sample.wav"
    print("Calling API...")
    result = client.automatic_speech_recognition(audio=url, model=MODEL_ID)
    print("Test result:", result)
except Exception as e:
    print("Error:", e)
    import traceback
    traceback.print_exc()
