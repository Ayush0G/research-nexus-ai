"use client";

import { useState, useRef } from "react";

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
  TECHNOLOGY: "bg-blue-100 text-blue-800 border-blue-200",
  TOPIC: "bg-purple-100 text-purple-800 border-purple-200",
  DATASET: "bg-green-100 text-green-800 border-green-200",
  RESEARCHER: "bg-amber-100 text-amber-800 border-amber-200",
  ALGORITHM: "bg-red-100 text-red-800 border-red-200",
  MODEL: "bg-pink-100 text-pink-800 border-pink-200",
};

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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

  const handleFileUpload = async () => {
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRepoSubmit = async () => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Research Nexus AI</h1>
        <p className="text-gray-500 mb-8">
          Upload a research document. AI will extract entities and discover connections.
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.md,.markdown"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 mb-4"
          />
          {file && (
            <p className="text-sm text-gray-600 mb-4">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
          <button
            onClick={handleFileUpload}
            disabled={!file || uploading}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add Repository</h2>
          <input
            type="text"
            placeholder="https://github.com/user/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <button
            onClick={handleRepoSubmit}
            disabled={!repoUrl || uploading}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Submitting..." : "Add Repository"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {result.status}
              </span>
              <span className="text-gray-400 text-sm">{result.source_type.toUpperCase()}</span>
              <span className="text-gray-400 text-sm">
                {result.entities.length} entities &middot; {result.relationships.length} connections
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-4">{result.title}</h3>

            <div className="flex gap-2 mb-6 border-b border-gray-200">
              {(["entities", "relationships", "content"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                    tab === t
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t === "entities" && `Entities (${result.entities.length})`}
                  {t === "relationships" && `Connections (${result.relationships.length})`}
                  {t === "content" && "Extracted Text"}
                </button>
              ))}
            </div>

            {tab === "entities" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.entities.map((e, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg px-3 py-2 ${ENTITY_COLORS[e.type] || "bg-gray-100 text-gray-800 border-gray-200"}`}
                  >
                    <p className="font-medium text-sm">{e.name}</p>
                    <p className="text-xs opacity-70">
                      {e.type} &middot; {(e.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                ))}
                {result.entities.length === 0 && (
                  <p className="text-gray-400 text-sm col-span-3">No entities found.</p>
                )}
              </div>
            )}

            {tab === "relationships" && (
              <div className="space-y-2">
                {result.relationships.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="font-medium text-gray-900">{r.source}</span>
                    <span className="text-gray-400">&rarr;</span>
                    <span className="text-indigo-600 font-medium">{r.relationship}</span>
                    <span className="text-gray-400">&rarr;</span>
                    <span className="font-medium text-gray-900">{r.target}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {(r.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
                {result.relationships.length === 0 && (
                  <p className="text-gray-400 text-sm">No connections found.</p>
                )}
              </div>
            )}

            {tab === "content" && result.raw_content && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {result.raw_content.slice(0, 5000)}
                  {result.raw_content.length > 5000 && (
                    <span className="text-gray-400">
                      {"\n\n... truncated (" + result.raw_content.length + " total chars)"}
                    </span>
                  )}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
