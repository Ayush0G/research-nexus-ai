import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestHealthEndpoint:
    def test_health_returns_200(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


class TestUploadEndpoint:
    def test_upload_valid_pdf_returns_200(self):
        """POST /api/documents/upload with valid PDF returns 200 and extracted data."""
        import fitz

        pdf_bytes = io.BytesIO()
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((72, 72), "Graph Neural Networks for Disease Prediction")
        doc.save(pdf_bytes)
        doc.close()
        pdf_bytes.seek(0)

        response = client.post(
            "/api/documents/upload",
            files={"file": ("test.pdf", pdf_bytes, "application/pdf")},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["source_type"] == "pdf"
        assert "id" in data
        assert "entities" in data
        assert "relationships" in data
        assert isinstance(data["entities"], list)
        assert isinstance(data["relationships"], list)

    def test_upload_valid_markdown_returns_200(self):
        """POST /api/documents/upload with valid Markdown returns 200."""
        md_content = b"# Research Paper\n\nDeep learning with PyTorch for healthcare."
        response = client.post(
            "/api/documents/upload",
            files={"file": ("test.md", io.BytesIO(md_content), "text/markdown")},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["source_type"] == "markdown"

    def test_upload_empty_file_returns_400(self):
        """POST /api/documents/upload with empty file returns 400."""
        response = client.post(
            "/api/documents/upload",
            files={"file": ("empty.pdf", io.BytesIO(b""), "application/pdf")},
        )
        assert response.status_code == 400

    def test_upload_invalid_type_returns_400(self):
        """POST /api/documents/upload with wrong file type returns 400."""
        response = client.post(
            "/api/documents/upload",
            files={"file": ("test.exe", io.BytesIO(b"binary"), "application/octet-stream")},
        )
        assert response.status_code == 400

    def test_upload_oversized_file_returns_400(self):
        """POST /api/documents/upload with file > 50MB returns 400."""
        large_content = b"x" * (50 * 1024 * 1024 + 1)
        response = client.post(
            "/api/documents/upload",
            files={"file": ("large.pdf", io.BytesIO(large_content), "application/pdf")},
        )
        assert response.status_code == 400


class TestRepositoryEndpoint:
    def test_add_repository_returns_200(self):
        """POST /api/documents/repository with valid URL returns 200."""
        response = client.post(
            "/api/documents/repository",
            json={"repository_url": "https://github.com/user/repo"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "document_id" in data
        assert data["status"] == "queued"

    def test_add_repository_missing_url_returns_422(self):
        """POST /api/documents/repository without URL returns 422 (Pydantic validation)."""
        response = client.post(
            "/api/documents/repository",
            json={},
        )
        assert response.status_code == 422


class TestStatusEndpoint:
    def test_status_nonexistent_returns_404(self):
        """GET /api/documents/{id}/status with fake ID returns 404."""
        response = client.get("/api/documents/00000000-0000-0000-0000-000000000000/status")
        assert response.status_code == 404
