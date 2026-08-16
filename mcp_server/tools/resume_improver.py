from mcp_instance import mcp
from google import genai
from google.genai import errors
from dotenv import load_dotenv
import os
import time

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def _generate(prompt: str, retries: int = 3) -> str:
    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model="gemini-3.5-flash",
                contents=prompt,
            )
            return response.text
        except errors.ClientError as e:
            if "429" in str(e) and attempt < retries - 1:
                time.sleep(5 * (attempt + 1))
                continue
            raise


@mcp.tool()
def improve_resume(text: str):
    prompt = f"""
Improve this resume professionally. Make it ATS-friendly with strong action verbs,
quantified achievements, and clear formatting.

{text}
"""
    return _generate(prompt)
