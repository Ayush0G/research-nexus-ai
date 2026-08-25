import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Text, Integer, Float, DateTime, ForeignKey, Enum as SAEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from .connection import Base


def generate_uuid():
    return uuid.uuid4()


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    firebase_uid = Column(String, unique=True, nullable=False, index=True)
    name = Column(String)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, default="researcher")
    department = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("Document", back_populates="uploader")


class Department(Base):
    __tablename__ = "departments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text)

    researchers = relationship("Researcher", back_populates="department")


class Researcher(Base):
    __tablename__ = "researchers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    bio = Column(Text)

    department = relationship("Department", back_populates="researchers")


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    source_type = Column(
        SAEnum("pdf", "markdown", "repository", name="source_type_enum"),
        nullable=False,
    )
    source_url = Column(String)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(
        SAEnum(
            "queued",
            "extracting_content",
            "chunking",
            "extracting_entities",
            "extracting_relationships",
            "generating_embeddings",
            "storing",
            "analyzing_similarity",
            "generating_insights",
            "completed",
            "failed",
            name="status_enum",
        ),
        default="queued",
    )
    raw_content = Column(Text)
    metadata_json = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime)

    uploader = relationship("User", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document")
    entities = relationship("DocumentEntity", back_populates="document")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    document_id = Column(
        UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False, index=True
    )
    content = Column(Text, nullable=False)
    section = Column(String)
    chunk_index = Column(Integer, nullable=False)
    embedding = Column(Vector(768))
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="chunks")


class Entity(Base):
    __tablename__ = "entities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    normalized_name = Column(String, nullable=False, index=True)
    entity_type = Column(
        SAEnum(
            "RESEARCHER",
            "PAPER",
            "TOPIC",
            "TECHNOLOGY",
            "DATASET",
            "ALGORITHM",
            "MODEL",
            "DEPARTMENT",
            "INSTITUTION",
            "METHODOLOGY",
            "PROGRAMMING_LANGUAGE",
            name="entity_type_enum",
        ),
        nullable=False,
    )
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    documents = relationship("DocumentEntity", back_populates="entity")
    source_relationships = relationship(
        "Relationship", foreign_keys="Relationship.source_entity_id", back_populates="source_entity"
    )
    target_relationships = relationship(
        "Relationship", foreign_keys="Relationship.target_entity_id", back_populates="target_entity"
    )


class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    source_entity_id = Column(
        UUID(as_uuid=True), ForeignKey("entities.id"), nullable=False, index=True
    )
    target_entity_id = Column(
        UUID(as_uuid=True), ForeignKey("entities.id"), nullable=False, index=True
    )
    relationship_type = Column(
        SAEnum(
            "AUTHORED",
            "USES",
            "IMPLEMENTS",
            "RELATED_TO",
            "BELONGS_TO",
            "RESEARCHES",
            "CITES",
            "SIMILAR_TO",
            "USES_DATASET",
            "COLLABORATES_WITH",
            name="relationship_type_enum",
        ),
        nullable=False,
    )
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    confidence = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    source_entity = relationship("Entity", foreign_keys=[source_entity_id], back_populates="source_relationships")
    target_entity = relationship("Entity", foreign_keys=[target_entity_id], back_populates="target_relationships")


class DocumentEntity(Base):
    __tablename__ = "document_entities"

    document_id = Column(
        UUID(as_uuid=True), ForeignKey("documents.id"), primary_key=True
    )
    entity_id = Column(
        UUID(as_uuid=True), ForeignKey("entities.id"), primary_key=True
    )
    frequency = Column(Integer, default=1)
    confidence = Column(Float, default=1.0)

    document = relationship("Document", back_populates="entities")
    entity = relationship("Entity", back_populates="documents")


class CollaborationInsight(Base):
    __tablename__ = "collaboration_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    researcher_a_id = Column(UUID(as_uuid=True), ForeignKey("researchers.id"))
    researcher_b_id = Column(UUID(as_uuid=True), ForeignKey("researchers.id"))
    connection_score = Column(Float, nullable=False)
    explanation = Column(Text)
    status = Column(String, default="detected")
    created_at = Column(DateTime, default=datetime.utcnow)


class SimilarityResult(Base):
    __tablename__ = "similarity_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    document_a_id = Column(
        UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False
    )
    document_b_id = Column(
        UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False
    )
    similarity_score = Column(Float, nullable=False)
    explanation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
