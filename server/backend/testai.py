# backend/test_ai.py
from services.ai_service import summarize_visit
from dotenv import load_dotenv
import asyncio

load_dotenv()

async def main(): 
    sample_transcript = """Doctor: Good morning, Ms. Smith. How are you feeling today?
        Patient: I’m feeling congested and sneezing a lot.
        Doctor: When did these symptoms start?
        Patient: About a week ago after moving into a new apartment.
        Doctor: Any medications?
        Patient: Claritin and Zyrtec, not helping much.
        Doctor: I recommend continue Zyrtec, start Nasonex nasal spray, monitor symptoms."""

    result = await summarize_visit({"transcript": sample_transcript})

    print("\n" + "="*60)
    print("GEMINI AI SUMMARY TEST")
    print("="*60)
    print(f"\nSummary:\n{result['summary']}")
    print(f"\nAction Items:")
    for item in result['action_items']:
        print(f"   - {item}")
    print(f"\nQuestions for Next Visit:")
    for q in result['questions_next_visit']:
        print(f"   - {q}")
    print(f"\nDiagnoses: {result['key_diagnoses']}")
    print(f"\nMedications: {result['medications']}")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main())
