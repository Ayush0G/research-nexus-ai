"use client";

import { useState, useRef, useCallback } from "react";

const API_URL = "http://localhost:8000";

interface Entity {
  name: string;
  type: string;
  confidence: number;
}

interface Relationship {
  source: string;
  relationship: string;
  target: string;
  confidence: number;
}

interface UploadResult {
  id: string;
  title: string;
  source_type: string;
  status: string;
  raw_content: string | null;
  entities: Entity[];
  relationships: Relationship[];
}

const ENTITY_COLORS: Record<string, string> = {
  TECHNOLOGY: "bg-blue-50 text-blue-900 border-blue-300",
  TOPIC: "bg-purple-50 text-purple-900 border-purple-300",
  DATASET: "bg-green-50 text-green-900 border-green-300",
  RESEARCHER: "bg-amber-50 text-amber-900 border-amber-300",
  ALGORITHM: "bg-red-50 text-red-900 border-red-300",
  MODEL: "bg-pink-50 text-pink-900 border-pink-300",
};

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"entities" | "relationships" | "content">("entities");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = useCallback(async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/documents/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }
      const data = await res.json();
      setResult(data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => resultRef.current?.focus(), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [file]);

  const handleRepoSubmit = useCallback(async () => {
    if (!repoUrl) return;
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/documents/repository`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repository_url: repoUrl }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Submission failed");
      }
      setRepoUrl("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setUploading(false);
    }
  }, [repoUrl]);

  return (
    <div className="min-h-screen bg-white p-8">
      <main className="max-w-5xl mx-auto" role="main">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Research Nexus AI
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Upload a research document. AI will extract entities and discover connections.
        </p>

        {/* Upload Card */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 mb-6" aria-labelledby="upload-heading">
          <h2 id="upload-heading" className="text-lg font-semibold mb-4">Upload Document</h2>
          <p className="text-sm text-gray-700 mb-4" id="upload-desc">
            Supports PDF and Markdown files up to 10MB.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.md,.markdown"
            aria-describedby="upload-desc"
            aria-label="Upload research document (PDF or Markdown)"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-700 file:text-white hover:file:bg-indigo-800 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          />
          {file && (
            <p className="text-sm text-gray-700 mb-4" aria-live="polite">
              Selected: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
          <button
            onClick={handleFileUpload}
            disabled={!file || uploading}
            aria-busy={uploading}
            aria-disabled={!file || uploading}
            className="bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            {uploading ? (
              <>
                <Spinner />
                Processing...
              </>
            ) : (
              "Upload & Extract"
            )}
          </button>
        </section>

        {/* Repository Card */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 mb-6" aria-labelledby="repo-heading">
          <h2 id="repo-heading" className="text-lg font-semibold mb-4">Add Repository</h2>
          <p className="text-sm text-gray-700 mb-4" id="repo-desc">
            Paste a public GitHub, GitLab, or Bitbucket repository URL.
          </p>
          <label htmlFor="repo-url" className="sr-only">Repository URL</label>
          <input
            id="repo-url"
            type="url"
            placeholder="https://github.com/user/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            aria-describedby="repo-desc"
            aria-label="Repository URL"
            className="w-full border border-gray-400 rounded-lg px-4 py-2.5 text-sm mb-4 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none text-gray-900 placeholder-gray-500"
          />
          <button
            onClick={handleRepoSubmit}
            disabled={!repoUrl || uploading}
            aria-disabled={!repoUrl || uploading}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
          >
            {uploading ? "Submitting..." : "Add Repository"}
          </button>
        </section>

        {/* Error */}
        {error && (
          <div role="alert" className="bg-red-50 border border-red-300 rounded-xl p-6 mb-6">
            <p className="text-red-900 font-medium">Error</p>
            <p className="text-red-800 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <section
            ref={resultRef}
            tabIndex={-1}
            aria-labelledby="result-heading"
            className="bg-white rounded-xl shadow-sm border border-gray-300 p-6 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="bg-green-100 text-green-900 text-xs font-medium px-2.5 py-1 rounded-full border border-green-300">
                {result.status}
              </span>
              <span className="text-gray-600 text-sm font-medium">
                {result.source_type.toUpperCase()}
              </span>
              <span className="text-gray-600 text-sm">
                {result.entities.length} entities &middot; {result.relationships.length} connections
              </span>
            </div>
            <h3 id="result-heading" className="text-lg font-semibold mb-4">{result.title}</h3>

            {/* Tab Navigation */}
            <div role="tablist" aria-label="Result views" className="flex gap-2 mb-6 border-b border-gray-200">
              {(["entities", "relationships", "content"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  id={`tab-${t}`}
                  aria-selected={tab === t}
                  aria-controls={`panel-${t}`}
                  tabIndex={tab === t ? 0 : -1}
                  onClick={() => setTab(t)}
                  onKeyDown={(e) => {
                    const tabs: ("entities" | "relationships" | "content")[] = ["entities", "relationships", "content"];
                    const idx = tabs.indexOf(t);
                    if (e.key === "ArrowRight") setTab(tabs[(idx + 1) % 3]);
                    if (e.key === "ArrowLeft") setTab(tabs[(idx + 2) % 3]);
                  }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 rounded-t ${
                    tab === t
                      ? "border-indigo-700 text-indigo-700"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t === "entities" && `Entities (${result.entities.length})`}
                  {t === "relationships" && `Connections (${result.relationships.length})`}
                  {t === "content" && "Extracted Text"}
                </button>
              ))}
            </div>

            {/* Entities Panel */}
            {tab === "entities" && (
              <div role="tabpanel" id="panel-entities" aria-labelledby="tab-entities">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.entities.map((e, i) => (
                    <div
                      key={i}
                      className={`border rounded-lg px-3 py-2 ${ENTITY_COLORS[e.type] || "bg-gray-50 text-gray-900 border-gray-300"}`}
                    >
                      <p className="font-medium text-sm">{e.name}</p>
                      <p className="text-xs opacity-80">
                        {e.type} &middot; {(e.confidence * 100).toFixed(0)}% confidence
                      </p>
                    </div>
                  ))}
                  {result.entities.length === 0 && (
                    <p className="text-gray-600 text-sm col-span-3">No entities found in this document.</p>
                  )}
                </div>
              </div>
            )}

            {/* Relationships Panel */}
            {tab === "relationships" && (
              <div role="tabpanel" id="panel-relationships" aria-labelledby="tab-relationships">
                <ul className="space-y-2" role="list">
                  {result.relationships.map((r, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm flex-wrap">
                      <span className="font-medium text-gray-900">{r.source}</span>
                      <span className="text-gray-500" aria-hidden="true">&rarr;</span>
                      <span className="text-indigo-700 font-medium">{r.relationship}</span>
                      <span className="text-gray-500" aria-hidden="true">&rarr;</span>
                      <span className="font-medium text-gray-900">{r.target}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {(r.confidence * 100).toFixed(0)}%
                      </span>
                    </li>
                  ))}
                  {result.relationships.length === 0 && (
                    <p className="text-gray-600 text-sm">No connections found in this document.</p>
                  )}
                </ul>
              </div>
            )}

            {/* Content Panel */}
            {tab === "content" && result.raw_content && (
              <div role="tabpanel" id="panel-content" aria-labelledby="tab-content">
                <pre
                  className="bg-gray-50 border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto text-sm text-gray-900 whitespace-pre-wrap font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  tabIndex={0}
                  aria-label="Extracted document text"
                >
                  {result.raw_content.slice(0, 5000)}
                  {result.raw_content.length > 5000 && (
                    <span className="text-gray-500">
                      {"\n\n... truncated (" + result.raw_content.length + " total characters)"}
                    </span>
                  )}
                </pre>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
