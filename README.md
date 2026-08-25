# Research Nexus AI

**AI-powered cross-disciplinary research intelligence platform that discovers hidden connections across university departments.**

University research is fragmented. Papers, datasets, theses, and repositories sit in separate silos with no shared visibility. Research Nexus AI uses AI to extract entities, identify relationships, and reveal hidden cross-disciplinary connections.

---

## What It Does

| Feature | Description |
|---------|-------------|
| **Document Ingestion** | Upload PDFs, Markdown files, or GitHub repositories |
| **Entity Extraction** | Automatically identifies technologies, topics, datasets, and researchers |
| **Relationship Mapping** | Discovers how entities connect (e.g., `PyTorch → USED_FOR → Healthcare`) |
| **Knowledge Graph** | Interactive visualization of research relationships |
| **Semantic Search** | Natural language search across all research content |
| **AI Assistant** | RAG-powered chat that answers questions using your research data |
| **Hidden Connections** | Detects cross-department collaboration opportunities |

---

## Tech Stack

```
Frontend          Backend           AI & Data         Infrastructure
─────────         ───────           ────────          ──────────────
Next.js           FastAPI           Vertex AI         Google Cloud Run
TypeScript        Python            LangChain         Vercel
Tailwind CSS      SQLAlchemy        LangGraph         Firebase Auth
React Flow        pgvector          AlloyDB           AlloyDB
```

---

## Project Structure

```
nexus-ai/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/            # Pages (App Router)
│   │   │   ├── components/     # UI components
│   │   │   └── lib/            # Utilities, API client, Firebase
│   │   └── public/             # Static assets
│   │
│   └── api/                    # FastAPI backend
│       ├── app/
│       │   ├── main.py         # Entry point
│       │   ├── config.py       # Environment settings
│       │   ├── routers/        # API endpoints
│       │   ├── services/       # Business logic
│       │   ├── schemas/        # Request/response models
│       │   └── database/       # Models, connection
│       ├── requirements.txt
│       └── Dockerfile
│
├── docs/                       # Documentation
├── .env.example                # Environment template
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- pnpm (or npm)

### 1. Clone & Install

```bash
# Frontend
cd apps/web
pnpm install

# Backend
cd ../api
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy template
cp .env.example apps/web/.env.local
cp .env.example apps/api/.env

# Edit apps/web/.env.local with your Firebase config
# Edit apps/api/.env with your GCP/AlloyDB config
```

### 3. Run

```bash
# Terminal 1 — Backend
cd apps/api
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2 — Frontend
cd apps/web
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/documents/upload` | Upload PDF/Markdown |
| `POST` | `/api/documents/repository` | Add GitHub repo URL |
| `GET` | `/api/documents/{id}/status` | Check processing status |
| `POST` | `/api/search` | Semantic search |
| `GET` | `/api/graph` | Get knowledge graph |
| `POST` | `/api/chat` | AI research assistant |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — problem, solution, technology |
| `/upload` | Upload documents and see AI extraction |
| `/dashboard` | Research metrics and insights |
| `/explore` | Interactive knowledge graph |
| `/search` | Semantic research search |
| `/assistant` | RAG-powered AI chat |
| `/insights` | Hidden collaborations and similar research |
| `/architecture` | System architecture visualization |
| `/ai` | AI-readable project specification |

---

## How It Works

```
Research Papers, PDFs, Markdown, Repos
              │
              ▼
    ┌─────────────────────┐
    │   Document Ingestion │  ← Upload & parse files
    └──────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │  Entity Extraction   │  ← Identify technologies, topics, people
    └──────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │ Relationship Mapping │  ← Connect entities to each other
    └──────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │  Vector Embeddings   │  ← Enable semantic search
    └──────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │   Knowledge Graph    │  ← Visualize connections
    └──────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │  Hidden Connections  │  ← Discover cross-department links
    └─────────────────────┘
```

---

## Environment Variables

### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Backend (`apps/api/.env`)

```env
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_REGION=us-central1
ALLOYDB_HOST=
ALLOYDB_PORT=5432
ALLOYDB_DATABASE=
ALLOYDB_USER=
ALLOYDB_PASSWORD=
FIREBASE_PROJECT_ID=
VERTEX_AI_PROJECT=
VERTEX_AI_LOCATION=us-central1
FRONTEND_URL=http://localhost:3000
```

---

## Deployment

### Frontend (Vercel)

```bash
cd apps/web
vercel --prod
```

### Backend (Cloud Run)

```bash
cd apps/api
gcloud run deploy research-nexus-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## License

MIT
