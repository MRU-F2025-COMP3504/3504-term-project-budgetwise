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
        className="bw-input"
      />
      {files.length > 0 && (
        <button
          onClick={uploadAll}
          disabled={uploading}
          className="px-4 py-2 rounded bg-[var(--color-accent-2)] text-white"
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
