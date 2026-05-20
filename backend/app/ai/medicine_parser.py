from openai import OpenAI
from dotenv import load_dotenv

import os
import json

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)


def parse_medicine_text(raw_text: str):

    prompt = f"""
You are a medical prescription parser.

Your tasks:
1. Read OCR extracted prescription text.
2. Fix OCR spelling mistakes intelligently.
3. Identify medicine names, dosages, and frequencies.
4. Return ONLY valid JSON.

IMPORTANT:
- Do not add explanations.
- Do not add markdown.
- Output must be pure JSON only.

JSON format:

{{
  "medicines": [
    {{
      "medicine_name": "",
      "dosage": "",
      "frequency": ""
    }}
  ]
}}

Prescription Text:
{raw_text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content.strip()

    try:
        parsed_json = json.loads(content)
        return parsed_json

    except Exception:
        return {
            "error": "Invalid JSON returned by AI",
            "raw_response": content
        }