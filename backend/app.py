from fastapi import FastAPI, UploadFile, File,Form
from fastapi.middleware.cors import CORSMiddleware
from services.mcp_client import call_github_tool

from services.mcp_client import call_resume_tool

app = FastAPI(
    title="CareerPilot AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://careerpilot-ai-seven-eta.vercel.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "CareerPilot AI Backend Running"
    }



@app.post("/resume")
async def analyze_resume(
    file: UploadFile = File(...),
    github_username: str = Form(...)
):
    result = await call_resume_tool(file, github_username)

    return {
        "status": "success",
        "analysis": result
    }


@app.get("/hello")
def hello():
    return {
        "msg": "Hello from Asshu"
    }


@app.get("/github/{username}")
async def github(username: str):

    result = await call_github_tool(username)

    return result