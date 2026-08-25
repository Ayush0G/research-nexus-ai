import os
import tempfile
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, HTTPException

from ..services.extraction_service import extract_pdf, extract_markdown

router = APIRouter(prefix="/api/documents", tags=["documents"])

ALLOWED_TYPES = {"application/pdf", "text/markdown", "text/x-markdown"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

# In-memory store for demo (no DB required)
documents_db: dict[str, dict] = {}


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Use PDF or Markdown.",
        )

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="File is empty.")
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File exceeds 50MB limit.")

    doc_id = str(uuid4())
    source_type = "pdf" if file.content_type == "application/pdf" else "markdown"

    with tempfile.NamedTemporaryFile(
        delete=False, suffix=os.path.splitext(file.filename or "")[1]
    ) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        if source_type == "pdf":
            raw_content = extract_pdf(tmp_path)
        else:
            raw_content = extract_markdown(tmp_path)
    except Exception as e:
        os.unlink(tmp_path)
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

    doc = {
        "id": doc_id,
        "title": file.filename or "Untitled",
        "source_type": source_type,
        "status": "completed",
        "raw_content": raw_content,
        "created_at": "2026-01-01T00:00:00",
        "processed_at": "2026-01-01T00:00:00",
    }
    documents_db[doc_id] = doc

    return doc


@router.post("/repository")
async def add_repository(body: dict):
    repo_url = body.get("repository_url", "")
    if not repo_url:
        raise HTTPException(status_code=400, detail="repository_url is required")

    doc_id = str(uuid4())
    doc = {
        "document_id": doc_id,
        "status": "queued",
    }
    documents_db[doc_id] = {
        "id": doc_id,
        "title": repo_url.split("/")[-1],
        "source_type": "repository",
        "status": "queued",
        "raw_content": None,
    }

    return doc


@router.get("/{document_id}/status")
async def get_status(document_id: str):
    doc = documents_db.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"document_id": doc["id"], "status": doc["status"]}
