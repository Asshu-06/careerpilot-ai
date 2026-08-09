from fastmcp import FastMCP
from docx import Document

mcp = FastMCP("Resume Parser")


def extract_docx_text(file):
    document = Document(file.file)

    text = ""

    for para in document.paragraphs:
        text += para.text + "\n"

    return text


@mcp.tool()
def parse_resume(text: str):
    return text