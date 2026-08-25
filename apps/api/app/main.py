from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .routers import documents

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Research Nexus AI",
    description="AI-powered cross-disciplinary research intelligence platform",
    version="0.1.0",
)

app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"error": {"code": "RATE_LIMITED", "message": "Too many requests. Try again in a minute."}},
    )


ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://research-nexus-ai.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(documents.router)


@app.get("/health")
@limiter.exempt
def health_check():
    return {"status": "healthy"}
