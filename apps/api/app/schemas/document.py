from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: UUID
    title: str
    source_type: str
    status: str
    raw_content: Optional[str] = None
    created_at: datetime
    processed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class RepositoryRequest(BaseModel):
    repository_url: str


class RepositoryResponse(BaseModel):
    document_id: UUID
    status: str


class ProcessingStatus(BaseModel):
    document_id: UUID
    status: str
    progress: Optional[int] = None
