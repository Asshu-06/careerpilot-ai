import fitz
from docx import Document
from io import BytesIO


def extract_resume_text(upload_file):
    filename = upload_file.filename.lower()

    if filename.endswith(".pdf"):
        pdf_bytes = upload_file.file.read()

        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        text = ""

        for page in doc:
            text += page.get_text()

        doc.close()

        upload_file.file.seek(0)

        return text

    elif filename.endswith(".docx"):
        doc = Document(BytesIO(upload_file.file.read()))

        text = "\n".join(p.text for p in doc.paragraphs)

        upload_file.file.seek(0)

        return text

    else:
        raise Exception("Unsupported file format")