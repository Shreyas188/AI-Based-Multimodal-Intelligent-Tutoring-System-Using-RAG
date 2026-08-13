import re
from docx import Document


def clean_line(text: str) -> str:
    return " ".join(text.strip().split())


def extract_topics_from_docx(docx_path: str):
    """
    Extracts study material from Word document.

    Expected heading format:
    Topic 1: Introduction to Electric Charges and Electrostatics
    Topic 2: Conductors and Insulators
    ...
    """

    document = Document(docx_path)

    topics = []
    current_topic = None
    current_lines = []

    topic_pattern = re.compile(
        r"^topic\s+(\d+)\s*[:\-]\s*(.+)$",
        re.IGNORECASE
    )

    for paragraph in document.paragraphs:
        text = clean_line(paragraph.text)

        if not text:
            continue

        match = topic_pattern.match(text)

        if match:
            if current_topic:
                current_topic["content"] = "\n".join(current_lines).strip()
                topics.append(current_topic)

            current_topic = {
                "topic_no": int(match.group(1)),
                "title": match.group(2).strip(),
                "content": ""
            }

            current_lines = []
        else:
            if current_topic:
                current_lines.append(text)

    if current_topic:
        current_topic["content"] = "\n".join(current_lines).strip()
        topics.append(current_topic)

    topics.sort(key=lambda item: item["topic_no"])

    return topics