from mcp_instance import mcp


@mcp.tool
def analyze_resume(text: str) -> dict:
    """
    Analyze resume and extract technical skills.
    """

    keywords = [
        "Python",
        "Java",
        "C++",
        "React",
        "Node.js",
        "FastAPI",
        "MongoDB",
        "PostgreSQL",
        "AWS",
        "Docker",
        "Git",
        "Machine Learning",
        "TensorFlow",
        "Spring Boot"
    ]

    found = []

    for skill in keywords:
        if skill.lower() in text.lower():
            found.append(skill)

    return {
        "skills": found,
        "count": len(found),
        "missing": list(set(keywords) - set(found))
    }