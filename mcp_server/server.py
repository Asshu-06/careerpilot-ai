import tools.resume_parser
import tools.ats_tool
import tools.resume_improver
import tools.github_tool
import tools.career_advisor_tool

from mcp_instance import mcp

if __name__ == "__main__":
    mcp.run(
        transport="http",
        host="127.0.0.1",
        port=9000
    )