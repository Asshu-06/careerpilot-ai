from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from services.mcp_client import call_github_tool, call_resume_tool
from typing import Optional

app = FastAPI(
    title="CareerPilot AI",
    version="1.0.0"
)

# Allow all origins so any frontend deployment works without touching this file.
# Tighten to specific domains once the Vercel URL is stable.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,   # must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "CareerPilot AI Backend Running"}


@app.post("/resume")
async def analyze_resume(
    file: UploadFile = File(...),
    github_username: str = Form(...),
    job_description: Optional[str] = Form(None),
    job_description_file: Optional[UploadFile] = File(None),
):
    result = await call_resume_tool(
        file,
        github_username,
        job_description=job_description,
        job_description_file=job_description_file,
    )
    return {"status": "success", "analysis": result}


@app.get("/hello")
def hello():
    return {"msg": "Hello from Asshu"}


@app.get("/github/{username}")
async def github(username: str):
    result = await call_github_tool(username)
    return result
