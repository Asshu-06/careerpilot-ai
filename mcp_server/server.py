import os
import tools.resume_parser
import tools.ats_tool
import tools.resume_improver
import tools.github_tool
import tools.career_advisor_tool

from mcp_instance import mcp

if __name__ == "__main__":
    mcp.run(
        transport="http",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 9000))
    )
  

