# backend/test_ai.py
from services.ai_service import summarize_visit
from dotenv import load_dotenv
import asyncio

load_dotenv()

async def main(): 
    sample_transcript = """
        Doctor: Hi, good morning! How have you been feeling since your last visit?
        Patient:Pretty good overall. I've been keeping up with my medication and walking most days.
        Doctor:That's great. Your lab results look normal, blood pressure is steady, and everything seems in good shape. Let’s continue with your current regimen.
        Patient:Sounds good. Should I book another check-up soon?
        Doctor:Yes, let's plan for next month from now unless anything changes.
    """

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
    print(f"\nReminders: {result['reminders']}")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main())
