import os
import asyncio
import json
from typing import Optional

from utils.resume_parser import extract_resume_text
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

# Set MCP_URL as an environment variable in Render:
# Key: MCP_URL   Value: https://your-mcp-server.onrender.com/mcp
MCP_URL = os.environ.get("MCP_URL", "http://127.0.0.1:9000/mcp")


# ── Helper: fresh connection per tool call ───────────────────────────────────
async def _call_tool(tool_name: str, arguments: dict) -> str:
    async with streamablehttp_client(MCP_URL) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await session.call_tool(tool_name, arguments)
            content = result.content[0].text
            if isinstance(content, dict):
                content = json.dumps(content)
            return content


# ── Main entry point ─────────────────────────────────────────────────────────
async def call_resume_tool(
    file,
    github_username: str,
    job_description: Optional[str] = None,
    job_description_file=None,
):
    resume_text = extract_resume_text(file)

    # Extract JD text from file if provided
    jd_text = ""
    if job_description_file:
        jd_text = extract_resume_text(job_description_file)
    elif job_description:
        jd_text = job_description

    # ATS, improve, and GitHub run in parallel — career advisor waits for all 3
    ats_text, improved_text, github_text = await asyncio.gather(
        _call_tool("analyze_resume", {"text": resume_text}),
        _call_tool("improve_resume",  {"text": resume_text}),
        _call_tool("analyze_github",  {"username": github_username}),
    )

    career_text = await _call_tool(
        "career_advisor",
        {
            "resume":          resume_text,
            "ats_analysis":    ats_text,
            "github_analysis": github_text,
        },
    )

    return {
        "parsed_resume":   resume_text,
        "ats_analysis":    ats_text,
        "improved_resume": improved_text,
        "github_analysis": github_text,
        "career_report":   career_text,
        "job_description": jd_text,   # echoed back for frontend display
    }


# ── GitHub-only endpoint ─────────────────────────────────────────────────────
async def call_github_tool(username: str):
    return await _call_tool("analyze_github", {"username": username})
