# Research Nexus AI — Demo Script

**Duration:** 5 minutes
**Goal:** Show judges how AI discovers hidden cross-disciplinary research connections.

---

## Pre-Demo Setup

1. Both servers running (backend on :8000, frontend on :3000)
2. Browser open to `http://localhost:3000`
3. Have a PDF research paper ready (ideally on AI/ML + healthcare or biology)

---

## Step 1: Show the Problem (30 seconds)

**Navigate to:** Landing page (`/`)

**Say:**
> "University research is fragmented. A computer science researcher publishes a paper on graph neural networks for disease prediction. Meanwhile, a biotechnology researcher publishes on protein interaction networks. They're working on nearly identical problems but don't know about each other."

**Click:** "Explore the network" button

---

## Step 2: Upload a Research Document (1 minute)

**Navigate to:** Upload page (`/upload`)

**Say:**
> "Let's add a research paper to the system. I'll upload this PDF."

**Action:**
1. Click "Choose File"
2. Select a research PDF (e.g., a paper on deep learning for medical imaging)
3. Click "Upload & Extract"

**Say:**
> "The AI is now extracting entities — technologies, topics, datasets, researchers — and mapping how they connect."

**Show:** The processing spinner, then the results appearing.

---

## Step 3: Show Extracted Entities (30 seconds)

**Navigate to:** "Entities" tab in results

**Say:**
> "Look what the AI found. It identified PyTorch, deep learning, healthcare, medical imaging, cancer detection — all from this single paper."

**Point at:** Different colored entity badges (blue for technology, purple for topic, green for dataset)

---

## Step 4: Show Relationships (30 seconds)

**Navigate to:** "Connections" tab

**Say:**
> "More importantly, it mapped the connections. PyTorch is USED_FOR deep learning. Deep learning is USED_FOR medical imaging. The researcher RESEARCHES healthcare."

**Point at:** The relationship arrows (source → relationship → target)

---

## Step 5: Reveal the Hidden Connection (1 minute)

**Say:**
> "Now here's where it gets interesting. Let me upload a second paper — this one from biotechnology on protein networks."

**Action:**
1. Upload a second PDF (on biology/protein networks)
2. Wait for extraction

**Say:**
> "Both papers use graph-based analysis. Both apply to biological data. But the researchers are in completely different departments."

**Show:** The insights page (`/insights`) if available, or explain the connection verbally.

**Key line:**
> "Research Nexus AI just discovered a cross-disciplinary connection that humans may have missed. Computer Science and Biotechnology are both working on graph-based prediction — and they should be talking."

---

## Step 6: Ask the AI Assistant (30 seconds)

**Navigate to:** Assistant page (`/assistant`)

**Type:** "Who should collaborate on graph-based biological research?"

**Say:**
> "The AI assistant uses RAG — Retrieval-Augmented Generation. It searches our ingested research, finds relevant papers, and generates an answer grounded in real data."

**Show:** The response with source citations.

---

## Closing (15 seconds)

**Say:**
> "Research Nexus AI transforms isolated papers into a connected intelligence network. It finds the hidden connections between research — connections that could spark the next breakthrough."

---

## Backup Talking Points

If asked about technical depth:
- "We use Vertex AI for entity extraction and embeddings"
- "AlloyDB provides PostgreSQL vector search for semantic similarity"
- "LangGraph orchestrates the multi-agent processing pipeline"
- "The knowledge graph updates in real-time as new research is ingested"

If asked about scalability:
- "Cloud Run handles auto-scaling for the backend"
- "Vercel handles edge deployment for the frontend"
- "The architecture is modular — each service can be independently replaced"

If asked about real-world impact:
- "This could prevent duplicate research studies"
- "It could discover collaboration opportunities worth millions in grant funding"
- "It makes the university's research intelligence visible and actionable"
