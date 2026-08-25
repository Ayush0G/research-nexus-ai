# Research Nexus AI

**AI-powered cross-disciplinary research intelligence platform that discovers hidden connections across university departments.**

---

## Challenge Requirements & Implementation

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| **Multi-format ingestion** | ✅ | PDF, Markdown, GitHub repository upload via `/upload` |
| **AI entity extraction** | ✅ | Pattern-based extraction of 200+ technologies, topics, datasets, researchers |
| **Relationship mapping** | ✅ | USES, IMPLEMENTS, RESEARCHES, USED_FOR, RELATED_TO connections |
| **Knowledge graph** | ✅ | Interactive node-edge visualization at `/explore` |
| **Semantic search** | ✅ | Natural language query via `/search` |
| **RAG assistant** | ✅ | AI chat answering questions from ingested research at `/assistant` |
| **Hidden collaboration detection** | ✅ | Cross-department connection scoring at `/insights` |
| **Redundant research detection** | ✅ | Document similarity comparison with explanations |
| **Firebase authentication** | ✅ | Google Sign-In with protected routes |
| **Deployment** | ✅ | Vercel (frontend) + Cloud Run (backend) ready |

---

## Problem Statement

University research is fragmented across departments, research groups, and repositories. Researchers publish papers, datasets, and code without knowing that similar work exists elsewhere in the university.

**Current pain points:**
- Research silos between departments
- Duplicate studies unknowingly repeated
- Valuable datasets remain undiscovered
- Potential collaborations missed
- No intelligent system connects distributed research

---

## Solution

Research Nexus AI ingests research content from multiple sources, uses AI to extract entities and relationships, and reveals hidden cross-disciplinary connections through an interactive knowledge graph.

### How It Works

```
Research Papers, PDFs, Markdown, Repos
              │
              ▼
    ┌─────────────────────┐
    │   Document Ingestion │  ← Parse PDF, Markdown, repositories
    └──────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │  Entity Extraction   │  ← Identify technologies, topics, people, datasets
    └──────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │ Relationship Mapping │  ← Connect entities (USES, IMPLEMENTS, RESEARCHES)
    └──────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │  Vector Embeddings   │  ← Enable semantic similarity search
    └──────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │   Knowledge Graph    │  ← Visualize all research connections
    └──────────┬──────────┘
               ▼
    ┌─────────────────────┐
    │  Hidden Connections  │  ← Discover cross-department collaborations
    └─────────────────────┘
```

---

## Features

### 1. Document Ingestion
Upload research papers (PDF), documentation (Markdown), or connect GitHub repositories. The system automatically extracts text and metadata.

### 2. AI Entity Extraction
Identifies technologies (PyTorch, TensorFlow), topics (healthcare, deep learning), datasets (ImageNet, PubMed), and researchers from document content.

### 3. Relationship Discovery
Maps how entities connect:
- `PyTorch → USED_FOR → Healthcare`
- `Dr. Smith → RESEARCHES → Deep Learning`
- `Graph Neural Networks → RELATED_TO → Protein Networks`

### 4. Interactive Knowledge Graph
Explore research connections visually. Click nodes to see entity details, connected relationships, and related documents.

### 5. Semantic Search
Ask natural language questions like "Find research on AI for medical imaging" and get relevant documents ranked by semantic similarity.

### 6. AI Research Assistant
RAG-powered chat that answers questions using your ingested research data. Returns answers with source citations.

### 7. Hidden Collaboration Detection
Identifies researchers from different departments working on related topics:
> "Computer Science and Biotechnology both use graph-based prediction models on biological networks."

### 8. Similar Research Detection
Flags potentially overlapping studies using embedding similarity, helping avoid duplicate effort.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI, SQLAlchemy |
| AI | Vertex AI, LangChain, LangGraph |
| Database | AlloyDB (PostgreSQL + pgvector) |
| Auth | Firebase Authentication |
| Deploy | Vercel (frontend), Cloud Run (backend) |

---

## Project Structure

```
nexus-ai/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/app/            # Pages
│   │   ├── src/components/     # UI components
│   │   └── src/lib/            # API client, Firebase
│   └── api/                    # FastAPI backend
│       ├── app/routers/        # API endpoints
│       ├── app/services/       # Extraction, entity, relationship logic
│       ├── app/database/       # Models, connection
│       └── tests/              # 15 passing tests
├── scripts/                    # Security scan tools
├── .github/workflows/          # CI/CD
└── README.md
```

---

## Quick Start

```bash
# Backend
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Frontend
cd apps/web
pnpm install
pnpm dev
```

Open http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/documents/upload` | Upload PDF/Markdown |
| POST | `/api/documents/repository` | Add GitHub repo |
| GET | `/api/documents/{id}/status` | Processing status |

---

## Security

- ✅ No hardcoded secrets (scan script at `scripts/scan_secrets.py`)
- ✅ File validation: 10MB limit, PDF/MD only
- ✅ CORS restricted to specific origins
- ✅ Rate limiting: 10 requests/minute/IP
- ✅ Environment variables for all credentials

---

## Testing

```bash
cd apps/api
pytest tests/ -v
# 15 tests passing
```

---

## Accessibility

- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation (arrow keys for tabs)
- ✅ Focus management (results receive focus after upload)
- ✅ WCAG AA color contrast (text on white backgrounds)
- ✅ Screen reader announcements (aria-live regions)

---

## License

MIT
