import os
import tempfile
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel, field_validator

from ..services.extraction_service import extract_pdf, extract_markdown
from ..services.entity_service import extract_entities
from ..services.relationship_service import extract_relationships

router = APIRouter(prefix="/api/documents", tags=["documents"])

ALLOWED_EXTENSIONS = {".pdf", ".md", ".markdown"}
ALLOWED_MIME_TYPES = {"application/pdf", "text/markdown", "text/x-markdown"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

documents_db: dict[str, dict] = {}


def _validate_file(file: UploadFile, contents: bytes):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required.")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{ext}'. Allowed: PDF, Markdown.",
        )

    if file.content_type and file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid MIME type '{file.content_type}'. Allowed: application/pdf, text/markdown.",
        )

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="File is empty.")

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds 10MB limit. Received: {len(contents) / 1024 / 1024:.1f}MB",
        )


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    contents = await file.read()
    _validate_file(file, contents)

    doc_id = str(uuid4())
    ext = os.path.splitext(file.filename or "")[1].lower()
    source_type = "pdf" if ext == ".pdf" else "markdown"

    tmp_dir = tempfile.mkdtemp()
    tmp_path = os.path.join(tmp_dir, f"upload{ext}")

    try:
        with open(tmp_path, "wb") as f:
            f.write(contents)

        if source_type == "pdf":
            raw_content = extract_pdf(tmp_path)
        else:
            raw_content = extract_markdown(tmp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
        if os.path.exists(tmp_dir):
            os.rmdir(tmp_dir)

    entities = extract_entities(raw_content)
    relationships = extract_relationships(raw_content, entities)

    doc = {
        "id": doc_id,
        "title": file.filename or "Untitled",
        "source_type": source_type,
        "status": "completed",
        "raw_content": raw_content,
        "entities": entities,
        "relationships": relationships,
        "created_at": "2026-01-01T00:00:00",
        "processed_at": "2026-01-01T00:00:00",
    }
    documents_db[doc_id] = doc

    return doc


class RepositoryRequest(BaseModel):
    repository_url: str

    @field_validator("repository_url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        if not v.startswith(("http://", "https://")):
            raise ValueError("URL must start with http:// or https://")
        if "github.com" not in v and "gitlab.com" not in v and "bitbucket.org" not in v:
            raise ValueError("Only GitHub, GitLab, and Bitbucket URLs are supported")
        return v


@router.post("/repository")
async def add_repository(request: RepositoryRequest):
    doc_id = str(uuid4())
    documents_db[doc_id] = {
        "id": doc_id,
        "title": request.repository_url.split("/")[-1],
        "source_type": "repository",
        "status": "queued",
        "raw_content": None,
        "entities": [],
        "relationships": [],
    }

    return {"document_id": doc_id, "status": "queued"}


@router.get("/{document_id}/status")
async def get_status(document_id: str):
    doc = documents_db.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"document_id": doc["id"], "status": doc["status"]}
