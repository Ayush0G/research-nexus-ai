from sqlalchemy import text

from .connection import engine, Base
from .models import (
    User, Department, Researcher, Document, DocumentChunk,
    Entity, Relationship, DocumentEntity,
    CollaborationInsight, SimilarityResult,
)


async def create_tables():
    try:
        async with engine.begin() as conn:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print(f"Warning: Could not create tables: {e}")
        print("Server will run without database. Set ALLOYDB_* env vars to enable.")
