"use client";

import { useState, useRef } from "react";

const API_URL = "http://localhost:8000";

interface UploadResult {
  id: string;
  title: string;
  source_type: string;
  status: string;
  raw_content: string | null;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      setResult({
        id: data.id,
        title: data.title,
        source_type: data.source_type,
        status: data.status,
        raw_content: data.raw_content,
      });
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
      const data = await res.json();
      setResult({
        id: data.document_id,
        title: repoUrl,
        source_type: "repository",
        status: data.status,
        raw_content: null,
      });
      setRepoUrl("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Research Nexus AI
        </h1>
        <p className="text-gray-500 mb-8">
          Upload a research document and see what the AI extracts.
        </p>

        {/* Upload Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
          <p className="text-sm text-gray-500 mb-4">
            Supports PDF and Markdown files up to 50MB.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.md,.markdown"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 mb-4"
          />
          {file && (
            <p className="text-sm text-gray-600 mb-4">
              Selected: <span className="font-medium">{file.name}</span> (
              {(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
          <button
            onClick={handleFileUpload}
            disabled={!file || uploading}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              "Upload & Extract"
            )}
          </button>
        </div>

        {/* Repository Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add Repository</h2>
          <p className="text-sm text-gray-500 mb-4">
            Paste a public GitHub repository URL.
          </p>
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

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {result.status}
              </span>
              <span className="text-gray-400 text-sm">
                {result.source_type.toUpperCase()}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-1">{result.title}</h3>
            <p className="text-xs text-gray-400 font-mono mb-4">{result.id}</p>

            {result.raw_content && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Extracted Content ({result.raw_content.length.toLocaleString()}{" "}
                  characters):
                </p>
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
              </div>
            )}

            {!result.raw_content && result.source_type === "repository" && (
              <p className="text-sm text-gray-500 italic">
                Repository queued for processing. Check status at{" "}
                <code className="bg-gray-100 px-1 rounded">
                  GET /api/documents/{result.id}/status
                </code>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
