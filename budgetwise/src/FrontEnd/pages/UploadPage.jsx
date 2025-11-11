"use client";
import { useState } from "react";

export default function UploadPage() {
  const [files, setFiles] = useState([]); // File[]
  const [results, setResults] = useState({}); // { [fileName]: { status: 'pending'|'ok'|'error', message: string } }
  const [uploading, setUploading] = useState(false);
  const [globalMessage, setGlobalMessage] = useState("");

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setGlobalMessage("");
    // Initialize results for display
    const initial = {};
    selected.forEach(f => {
      initial[f.name] = { status: 'pending', message: 'Ready to upload' };
    });
    setResults(initial);
  }

  async function uploadFiles(targetFiles = files) {
    if (!targetFiles.length) {
      setGlobalMessage("Please choose at least one CSV file.");
      return;
    }
    setUploading(true);
    const newResults = { ...results };
    for (const f of targetFiles) {
      newResults[f.name] = { status: 'uploading', message: 'Uploading...' };
      setResults({ ...newResults });
      const fd = new FormData();
      fd.append("file", f);
      try {
        const res = await fetch("/api/statements", { method: "POST", body: fd });
        let data = {};
        try { data = await res.json(); } catch { /* ignore parse */ }
        if (res.ok) {
          newResults[f.name] = { status: 'ok', message: `✅ Uploaded: ${data.file || f.name}` };
        } else {
          newResults[f.name] = { status: 'error', message: `❌ Failed: ${data.error || res.statusText}` };
        }
      } catch (err) {
        newResults[f.name] = { status: 'error', message: `❌ Error: ${err.message}` };
      }
      setResults({ ...newResults });
    }
    setUploading(false);
    const allOk = Object.values(newResults).every(r => r.status === 'ok');
    setGlobalMessage(allOk ? `✅ All ${targetFiles.length} file(s) uploaded successfully.` : `ℹ️ Upload finished. Review results below.`);
  }

  async function uploadSingle(f) {
    await uploadFiles([f]);
  }

  return (
    <div className="bw-container py-8">
      <h1 className="text-2xl font-semibold mb-2">Upload CSV Files</h1>
      <p className="bw-text-muted text-sm mb-6 max-w-prose">Choose one or multiple bank statement CSV files. Each file will be processed and categorized automatically.</p>
      {/* Unified upload card */}
      <div className="bw-card p-6 relative flex flex-col">
        <h2 className="font-medium mb-3">Choose Files</h2>
        <div className="border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-xl p-5 w-full flex flex-col gap-4 relative" aria-live="polite">
          <label className="text-xs uppercase tracking-wide font-semibold opacity-80" htmlFor="file-input">Choose CSV File(s)</label>
          <input
            id="file-input"
            type="file"
            name="files"
            accept=".csv"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[var(--color-surface-2)] file:text-[var(--color-text)] file:cursor-pointer file:hover:bg-[var(--color-surface)] file:transition"
            aria-describedby={files.length ? 'selected-files' : undefined}
            aria-label="Select one or more CSV statement files"
          />
          {files.length > 0 && (
            <div id="selected-files" className="text-xs bw-text-muted space-y-1">
              <p className="font-semibold">Selected ({files.length}):</p>
              <ul className="list-disc list-inside space-y-0">
                {files.map(f => (
                  <li key={f.name} className="flex justify-between items-center gap-2">
                    <span className="truncate max-w-[60%]" title={f.name}>{f.name}</span>
                    <span className="text-[10px] opacity-70">{(f.size/1024).toFixed(1)} KB</span>
                    {results[f.name]?.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => uploadSingle(f)}
                        disabled={uploading}
                        className="text-[10px] underline hover:no-underline"
                        aria-label={`Upload file ${f.name}`}
                      >Upload</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {files.length > 1 && (
            <button
              type="button"
              onClick={() => uploadFiles()}
              disabled={uploading}
              className="bw-btn bw-btn-primary bw-btn-block"
              aria-label={uploading ? 'Uploading files' : `Upload ${files.length} files`}
              aria-busy={uploading ? 'true' : 'false'}
            >
              {uploading ? 'Uploading...' : `Upload All (${files.length})`}
            </button>
          )}
          {files.length === 1 && (
            <button
              type="button"
              onClick={() => uploadFiles()}
              disabled={uploading}
              className="bw-btn bw-btn-primary bw-btn-block"
              aria-label={uploading ? 'Uploading file' : 'Upload selected file'}
              aria-busy={uploading ? 'true' : 'false'}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          )}
        </div>
        {/* Results section */}
        <div className="mt-4 space-y-2 text-xs" aria-live="polite">
          {Object.keys(results).map(name => (
            <div key={name} className="bw-card p-2 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <strong className="truncate max-w-[65%]" title={name}>{name}</strong>
                <span className={`text-[10px] ${results[name].status === 'ok' ? 'text-[var(--color-success)]' : results[name].status === 'error' ? 'text-[var(--color-danger)]' : 'opacity-60'}`}>{results[name].status}</span>
              </div>
              <span>{results[name].message}</span>
            </div>
          ))}
          {!files.length && <p className="text-[var(--color-text-muted)]">No files selected yet.</p>}
        </div>
        {globalMessage && (
          <p
            role="status"
            className={`mt-4 text-center text-sm ${globalMessage.startsWith('✅') ? 'text-[var(--color-success)]' : globalMessage.startsWith('❌') ? 'text-[var(--color-danger)]' : 'opacity-80'}`}
          >
            {globalMessage}
          </p>
        )}
      </div>
    </div>
  );
}
