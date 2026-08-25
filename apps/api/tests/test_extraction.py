import os
import tempfile
import pytest
from app.services.extraction_service import extract_pdf, extract_markdown, parse_markdown_sections


class TestPDFExtraction:
    def test_extract_text_from_valid_pdf(self):
        """Valid PDF text extraction returns non-empty content."""
        import fitz

        tmp_dir = tempfile.mkdtemp()
        pdf_path = os.path.join(tmp_dir, "test.pdf")

        doc = fitz.open()
        page = doc.new_page()
        text = "Machine Learning for Healthcare\nDeep learning models are used for cancer detection."
        page.insert_text((72, 72), text)
        doc.save(pdf_path)
        doc.close()

        try:
            result = extract_pdf(pdf_path)
            assert isinstance(result, str)
            assert len(result) > 0
            assert "Machine Learning" in result
            assert "cancer detection" in result
        finally:
            os.unlink(pdf_path)
            os.rmdir(tmp_dir)

    def test_extract_text_from_empty_pdf(self):
        """Empty PDF returns empty string without crashing."""
        import fitz

        tmp_dir = tempfile.mkdtemp()
        pdf_path = os.path.join(tmp_dir, "empty.pdf")

        doc = fitz.open()
        doc.new_page()
        doc.save(pdf_path)
        doc.close()

        try:
            result = extract_pdf(pdf_path)
            assert isinstance(result, str)
            assert len(result) == 0
        finally:
            os.unlink(pdf_path)
            os.rmdir(tmp_dir)

    def test_extract_text_from_corrupt_file(self):
        """Corrupt file raises an exception gracefully."""
        tmp_dir = tempfile.mkdtemp()
        corrupt_path = os.path.join(tmp_dir, "corrupt.pdf")

        with open(corrupt_path, "wb") as f:
            f.write(b"this is not a valid pdf")

        try:
            with pytest.raises(Exception):
                extract_pdf(corrupt_path)
        finally:
            os.unlink(corrupt_path)
            os.rmdir(tmp_dir)


class TestMarkdownExtraction:
    def test_extract_markdown_content(self):
        """Markdown extraction preserves content."""
        content = "# Research Paper\n\nThis is about deep learning.\n\n## Methods\n\nWe used PyTorch."
        tmp_dir = tempfile.mkdtemp()
        md_path = os.path.join(tmp_dir, "test.md")

        with open(md_path, "w", encoding="utf-8") as f:
            f.write(content)

        try:
            result = extract_markdown(md_path)
            assert "deep learning" in result
            assert "PyTorch" in result
        finally:
            os.unlink(md_path)
            os.rmdir(tmp_dir)

    def test_parse_markdown_sections(self):
        """Markdown section parsing splits headings correctly."""
        content = "# Title\nContent 1\n## Section A\nContent 2\n## Section B\nContent 3"
        sections = parse_markdown_sections(content)
        assert len(sections) == 3
        assert sections[0]["heading"] == "Title"
        assert sections[1]["heading"] == "Section A"
        assert sections[2]["heading"] == "Section B"

    def test_extract_empty_markdown(self):
        """Empty markdown file returns empty string."""
        tmp_dir = tempfile.mkdtemp()
        md_path = os.path.join(tmp_dir, "empty.md")

        with open(md_path, "w", encoding="utf-8") as f:
            f.write("")

        try:
            result = extract_markdown(md_path)
            assert result == ""
        finally:
            os.unlink(md_path)
            os.rmdir(tmp_dir)
