from utils.resume_parser import extract_resume_text
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client


MCP_URL = "https://careerpilot-ai-tdh0.onrender.com/mcp"


async def call_resume_tool(file, github_username: str):
    resume_text = extract_resume_text(file)

    async with streamablehttp_client(MCP_URL) as (
        read_stream,
        write_stream,
        _,
    ):
        async with ClientSession(read_stream, write_stream) as session:

            await session.initialize()

            # ATS Analysis
            ats = await session.call_tool(
                "analyze_resume",
                {
                    "text": resume_text
                }
            )

            # Resume Improvement
            improved = await session.call_tool(
                "improve_resume",
                {
                    "text": resume_text
                }
            )

            # GitHub Analysis
            github = await session.call_tool(
                "analyze_github",
                {
                    "username": github_username
                }
            )

            # Final Career Advisor
            career = await session.call_tool(
                "career_advisor",
                {
                    "resume": resume_text,
                    "ats_analysis": ats.content[0].text,
                    "github_analysis": github.content[0].text
                }
            )

            return {
                "parsed_resume": resume_text,
                "ats_analysis": ats.content[0].text,
                "improved_resume": improved.content[0].text,
                "github_analysis": github.content[0].text,
                "career_report": career.content[0].text
            }


async def call_github_tool(username: str):

    async with streamablehttp_client(MCP_URL) as (
        read_stream,
        write_stream,
        _,
    ):
        async with ClientSession(read_stream, write_stream) as session:

            await session.initialize()

            result = await session.call_tool(
                "analyze_github",
                {
                    "username": username
                }
            )

            return result.content[0].text