from mcp_instance import mcp
from docx import Document

def extract_docx_text(file):
    document = Document(file.file)

    text = ""

    for p in document.paragraphs:
        text += p.text + "\n"

    return text


@mcp.tool()
def parse_resume(file):
    return extract_docx_text(file)