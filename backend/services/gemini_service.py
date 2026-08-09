from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def analyze_resume(text):
    prompt = f"""
Analyze this resume.

Provide:

1. Candidate Name
2. Resume Score (/100)
3. Technical Skills
4. Missing Skills
5. Strengths
6. Weaknesses
7. Suggestions

Resume:
{text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text
def improve_resume(text):

    prompt = f"""
Improve the following resume.

Rewrite it professionally.

Resume:

{text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text