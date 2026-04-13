from transformers import pipeline

# Create ASR pipeline
pipe = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-base.en",
    device="mps"  # Use MPS on Mac
)

# Transcribe the sample audio
result = pipe("sample.wav")
print("Transcription:", result['text'])
