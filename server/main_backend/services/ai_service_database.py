import os
import json
import time
import google.generativeai as genai
from typing import Dict
from .db_service import log_ai_usage, get_prompt_text_supabase

async def summarize_visit(data: dict) -> Dict:
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)

    model_name = os.getenv("MODEL_NAME")
    model = genai.GenerativeModel(model_name)

    INPUT_COST_PER_M = float(os.getenv("GEMINI_INPUT_COST_PER_M"))
    OUTPUT_COST_PER_M = float(os.getenv("GEMINI_OUTPUT_COST_PER_M"))

    transcript = data["transcript"]
    prompt = build_gemini_prompt(transcript)
    
    try:
        start_time = time.time()
        response = model.generate_content(prompt)
        latency = time.time() - start_time

        input_tokens = response.usage_metadata.prompt_token_count
        output_tokens = response.usage_metadata.candidates_token_count

        input_cost = (input_tokens / 1_000_000) * INPUT_COST_PER_M
        output_cost = (output_tokens / 1_000_000) * OUTPUT_COST_PER_M
        total_cost = input_cost + output_cost

        log_data = {
            "visit_id": data.get("visit_id"),
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_cost": total_cost,
        }
    
        await log_ai_usage(log_data)

        text_output = response.text.strip()
        start_json = text_output.find("{")
        end_json = text_output.rfind("}")
        json_string = text_output[start_json:end_json + 1]        
        json_output = json.loads(json_string)
        
        print(f"Summary generated in {latency:.2f}s")
        print(f"Tokens: {input_tokens} in, {output_tokens} out")
        print(f"Cost: ${total_cost:.6f}")
        
        result = {
            "summary": json_output.get("summary", f"AI Processing error:{transcript}"),
            "action_items": json_output.get("action_items", []),
            "questions_next_visit": json_output.get("questions_next_visit", []),
            "key_diagnoses": json_output.get("key_diagnoses", []),
            "medications": json_output.get("medications", [])
        }
        
        return result
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing failed: {e}")
        return {
            "summary": f"Error processing visit summary. Please contact support:{transcript}",
            "action_items": ["Review visit recording"],
            "questions_next_visit": ["Could you clarify the diagnosis?"],
            "key_diagnoses": [],
            "medications": []
        }
    except Exception as e:
        print(f"Gemini API error: {e}")
        raise Exception(f"AI service failed: {str(e)}")


def build_gemini_prompt(transcript_text: str) -> str:
    base_prompt, examples = get_prompt_text_supabase("Clinical Summary", limit=2)
    
    if not base_prompt:
        base_prompt = """You are a warm, friendly highly efficient Clinical Documentation Assistant.
        Your task is to process the doctor-patient visit transcript and structure the information into a single, valid JSON object.

        Response Rules:
        - Output ONLY the JSON object (no markdown, commentary, or reasoning).
        - Keep the tone friendly, natural, and easy to understand — avoid medical jargon or technical terms.
        - Focus on clarity and empathy, as if explaining to a patient or caregiver.
        - Use the following keys:
        "summary": a short, plain-language recap of what was discussed during the visit including (if mentioned) chief complaint, cause, and the primary plan. The text must be written entirely in the **third person** (e.g., "The patient presented with...", "The doctor recommended...").
        "action_items": List every specific directive the doctor asked the patient to do next.
        "questions_next_visit": Generate at least two simple, caring questions a patient might ask at their next appointment. Use 2–3 relevant questions from the following styles: routine, medication, chronic, or caregiver. Keep them short, supportive, and in plain language.
        "key_diagnoses": **List all main diagnoses, conditions, or primary concerns** mentioned (if any).
        "medications": **List all medications mentioned** (prescribed, existing, or discontinued)."""

    final_prompt = f"{base_prompt}\n"

    for ex in examples:
        output_text = ex['example_output'].strip()
        if output_text.startswith('{') and output_text.endswith('}'):
            try:
                json_data = json.loads(output_text)
                formatted_output = json.dumps(json_data, indent=2)
            except json.JSONDecodeError:
                formatted_output = output_text
        else:
            formatted_output = output_text

        final_prompt += f"\n---\nExample Input:\n{ex['example_input']}\nExample Output:\n{formatted_output}\n"
    
    final_prompt += f"\n---\nTranscript:\n\"\"\"{transcript_text}\"\"\"\n"
    final_prompt += "Return ONLY the JSON object, formatted as requested above."
    
    return final_prompt
