from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from ..config import settings

DATABASE_URL = (
    f"postgresql+asyncpg://{settings.alloydb_user}:{settings.alloydb_password}"
    f"@{settings.alloydb_host}:{settings.alloydb_port}/{settings.alloydb_database}"
)

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session
