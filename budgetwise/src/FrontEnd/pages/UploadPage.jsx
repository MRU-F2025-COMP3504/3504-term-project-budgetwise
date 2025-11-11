"use client";
import { useState } from "react";
import FileUploadQueue from "../components/FileUploadQueue";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return setMessage("Please select a file first");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/statements", { method: "POST", body: formData });
      const data = await res.json().catch(()=>({}));
      if (res.ok) setMessage(`✅ Uploaded successfully: ${data.file || file.name}`);
      else setMessage(`❌ Upload failed: ${data.error || res.statusText}`);
    } catch (err) {
      setMessage(`❌ Upload error: ${err.message}`);
    }
  }

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    setFile(selected || null);
    setPreview(selected ? selected.name : "");
    if (selected) setMessage("");
  }

  return (
    <div className="bw-container py-8">
      <h1 className="text-2xl font-semibold mb-2">Upload CSV File</h1>
      <p className="bw-text-muted text-sm mb-6 max-w-prose">Upload individual or multiple bank statement CSV files. Each file is processed and categorized automatically.</p>
      <div className="grid gap-6 md:grid-cols-2 relative">
        {/* Single file upload card */}
        <div className="bw-card p-6 relative flex flex-col">
          <h2 className="font-medium mb-3">Single File</h2>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" autoComplete="off" aria-label="Single CSV upload form">
            <div className="border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-xl p-5 w-full flex flex-col gap-4 relative">
              <label className="text-xs uppercase tracking-wide font-semibold opacity-80" htmlFor="single-file-input">Choose CSV File</label>
              <input
                id="single-file-input"
                type="file"
                name="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[var(--color-surface-2)] file:text-[var(--color-text)] file:cursor-pointer file:hover:bg-[var(--color-surface)] file:transition"
                aria-describedby={preview ? 'selected-file' : undefined}
              />
              {preview && (
                <p id="selected-file" className="text-xs bw-text-muted">Selected: {preview}</p>
              )}
              <button
                type="submit"
                className="bw-btn bw-btn-primary bw-btn-block"
                aria-label="Upload selected CSV file"
              >
                Upload File
              </button>
            </div>
          </form>
          {message && (
            <p
              role="status"
              className={`mt-4 text-center text-sm ${message.startsWith('❌') ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'}`}
            >
              {message}
            </p>
          )}
        </div>
        {/* Bulk upload section */}
        <div className="bw-card p-6 flex flex-col">
          <h2 className="font-medium mb-3">Bulk Upload (Multi-file)</h2>
          <FileUploadQueue />
        </div>
      </div>
    </div>
  );
}
