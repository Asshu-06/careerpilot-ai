from mcp_instance import mcp
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


@mcp.tool()
def career_advisor(
    resume: str,
    ats_analysis: str,
    github_analysis: str
):
    """
    Generates a final career report by combining
    Resume + ATS + GitHub Analysis.
    """

    prompt = f"""
You are an expert Technical Recruiter, Senior Software Engineer,
and Career Mentor.

Analyze the candidate using ALL the information below.

========================================================
RESUME
========================================================

{resume}

========================================================
ATS ANALYSIS
========================================================

{ats_analysis}

========================================================
GITHUB ANALYSIS
========================================================

{github_analysis}

========================================================

Generate a professional report in the following format.

# CareerPilot AI Career Report

## 1. Overall Employability Score
Give score out of 100.

Explain why.

--------------------------------------------------

## 2. Resume Score

Score out of 100.

Strengths

Weaknesses

--------------------------------------------------

## 3. GitHub Portfolio Score

Score out of 100.

Mention

- coding quality
- projects
- repository quality
- technologies
- activity

--------------------------------------------------

## 4. ATS Score Summary

Summarize ATS analysis.

--------------------------------------------------

## 5. Strongest Skills

Mention top technical skills.

--------------------------------------------------

## 6. Missing Skills

Mention important missing technologies.

--------------------------------------------------

## 7. Project Review

Mention

Best project

Weakest project

Project ideas to improve portfolio

--------------------------------------------------

## 8. Interview Readiness

Score out of 10.

Mention

Technical readiness

Coding readiness

Communication readiness

--------------------------------------------------

## 9. Learning Roadmap

Week 1

Week 2

Week 3

Week 4

--------------------------------------------------

## 10. Recommended Technologies

Mention technologies to learn next.

--------------------------------------------------

## 11. Recommended Certifications

Mention useful certifications.

--------------------------------------------------

## 12. Final Verdict

Can this candidate apply for

- Internship

- SDE-1

- Full Stack Developer

- AI Engineer

Mention reasons.

End with motivation and clear next steps.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    return response.text