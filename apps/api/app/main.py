from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import documents

app = FastAPI(
    title="Research Nexus AI",
    description="AI-powered cross-disciplinary research intelligence platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)


@app.get("/health")
def health_check():
    return {"status": "healthy"}
