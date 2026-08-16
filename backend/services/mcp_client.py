import os
import json
import asyncio
from typing import Optional

from utils.resume_parser import extract_resume_text
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

# Set MCP_URL as an environment variable in Render:
# Key: MCP_URL   Value: https://your-mcp-server.onrender.com/mcp
MCP_URL = os.environ.get("MCP_URL", "http://127.0.0.1:9000/mcp")


def _text(result) -> str:
    """Extract text from an MCP tool result, normalising dicts to JSON."""
    content = result.content[0].text
    if isinstance(content, dict):
        return json.dumps(content)
    return content


async def call_resume_tool(
    file,
    github_username: str,
    job_description: Optional[str] = None,
    job_description_file=None,
):
    resume_text = extract_resume_text(file)

    # Extract JD text from uploaded file if provided
    jd_text = ""
    if job_description_file:
        jd_text = extract_resume_text(job_description_file)
    elif job_description:
        jd_text = job_description

    # Single session — all tool calls share one connection (avoids 429 on free tier)
    async with streamablehttp_client(MCP_URL) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()

            ats_result      = await session.call_tool("analyze_resume", {"text": resume_text})
            await asyncio.sleep(1)
            improved_result = await session.call_tool("improve_resume",  {"text": resume_text})
            await asyncio.sleep(1)
            github_result   = await session.call_tool("analyze_github",  {"username": github_username})
            await asyncio.sleep(1)

            ats_text      = _text(ats_result)
            improved_text = _text(improved_result)
            github_text   = _text(github_result)

            career_result = await session.call_tool(
                "career_advisor",
                {
                    "resume":          resume_text,
                    "ats_analysis":    ats_text,
                    "github_analysis": github_text,
                },
            )
            career_text = _text(career_result)

    return {
        "parsed_resume":   resume_text,
        "ats_analysis":    ats_text,
        "improved_resume": improved_text,
        "github_analysis": github_text,
        "career_report":   career_text,
        "job_description": jd_text,
    }


async def call_github_tool(username: str):
    async with streamablehttp_client(MCP_URL) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await session.call_tool("analyze_github", {"username": username})
            return _text(result)
