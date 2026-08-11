from mcp_instance import mcp
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@mcp.tool()
def career_advisor(resume: str, ats_analysis: str, github_analysis: str):
    """Generates a concise career report combining Resume + ATS + GitHub."""

    prompt = f"""
You are a senior technical recruiter and career mentor.
Analyze the candidate using the data below and write a concise professional report.

RESUME:
{resume}

ATS ANALYSIS:
{ats_analysis}

GITHUB ANALYSIS:
{github_analysis}

Write the report using EXACTLY this structure (keep each section short and actionable):

# CareerPilot AI Career Report

## Overall Employability Score
Score /100 and one-line reason.

## Resume Score
Score /100. Top 3 strengths. Top 2 weaknesses.

## GitHub Portfolio Score
Score /100. Highlight coding quality, best project, activity level.

## Strongest Skills
List top 6 technical skills.

## Missing Skills
List top 5 missing technologies the candidate should learn.

## Learning Roadmap
Week 1: ...
Week 2: ...
Week 3: ...
Week 4: ...

## Recommended Technologies
3-4 technologies to learn next with one-line reason each.

## Final Verdict
Can this candidate apply for Internship / SDE-1 / Full Stack / AI Engineer?
End with 2-3 lines of motivation and clear next steps.
"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )

    return response.text
