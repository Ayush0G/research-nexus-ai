import re

import fitz  # PyMuPDF
import markdown


def extract_pdf(file_path: str) -> str:
    doc = fitz.open(file_path)
    text_parts = []
    for page in doc:
        text = page.get_text()
        if text.strip():
            text_parts.append(text)
    doc.close()
    return "\n\n".join(text_parts)


def extract_markdown(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    return content


def parse_markdown_sections(content: str) -> list[dict]:
    sections = []
    current_section = {"heading": "Untitled", "content": ""}

    for line in content.split("\n"):
        if line.startswith("#"):
            if current_section["content"].strip():
                sections.append(current_section)
            current_section = {"heading": line.lstrip("#").strip(), "content": ""}
        else:
            current_section["content"] += line + "\n"

    if current_section["content"].strip():
        sections.append(current_section)

    return sections
