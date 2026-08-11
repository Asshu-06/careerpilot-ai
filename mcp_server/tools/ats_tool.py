from mcp_instance import mcp
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@mcp.tool()
def analyze_resume(text: str):

    prompt = f"""
Analyze this resume.

{text}

Return

ATS Score
Skills
Missing Skills
Suggestions
"""

    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=prompt
    )

    return response.text