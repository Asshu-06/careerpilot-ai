from mcp_instance import mcp
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@mcp.tool()
def improve_resume(text: str):

    prompt = f"""
Improve this resume.

{text}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    return response.text