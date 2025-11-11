"use client";
import { useState } from "react";

export default function FileUploadQueue() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);

  function onSelect(e) {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  }

  async function uploadAll() {
    setUploading(true);
    const out = [];
    for (const f of files) {
      const fd = new FormData();
      fd.append("file", f);
      try {
        const res = await fetch("/api/statements", { method: "POST", body: fd });
        let data = {};
        try { data = await res.json(); } catch { /* ignore parse */ }
        out.push({ file: f.name, ok: res.ok, data });
      } catch (err) {
        out.push({ file: f.name, ok: false, data: { error: err.message } });
      }
    }
    setResults(out);
    setUploading(false);
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        accept=".csv"
        onChange={onSelect}
        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[var(--color-surface-2)] file:text-[var(--color-text)] file:cursor-pointer file:hover:bg-[var(--color-surface)] file:transition"
        aria-label="Select one or more CSV files for bulk upload"
      />
      {files.length > 0 && (
        <button
          onClick={uploadAll}
          disabled={uploading}
          className="bw-btn bw-btn-primary bw-btn-block"
          aria-label={uploading ? 'Uploading files' : `Upload ${files.length} files`}
          aria-busy={uploading ? 'true' : 'false'}
        >
          {uploading ? "Uploading..." : `Upload ${files.length} file(s)`}
        </button>
      )}
      <div className="space-y-2 text-xs">
        {results.map(r => (
          <div key={r.file} className="bw-card p-2">
            <strong>{r.file}</strong>: {r.ok ? "✅" : "❌"} {r.data.error || "Uploaded"}
          </div>
        ))}
        {results.length === 0 && files.length === 0 && (
          <p className="text-[var(--color-text-muted)]">Select CSV files to upload.</p>
        )}
      </div>
    </div>
  );
}
