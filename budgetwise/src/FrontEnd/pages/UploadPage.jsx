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
      <h1 className="text-2xl font-semibold mb-4">Upload CSV File</h1>
      <div className="grid gap-6 md:grid-cols-2 relative">
        <div className="bw-card p-6 relative">
          <h2 className="font-medium mb-3">Single File</h2>
          <form onSubmit={handleSubmit} className="w-full" autoComplete="off">
            <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 w-full flex flex-col items-center gap-4 relative">
              <input
                type="file"
                name="file"
                accept=".csv"
                onChange={handleFileChange}
                className="bw-input w-full"
              />
              {preview && (
                <p className="text-sm text-gray-600">Selected: {preview}</p>
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 relative z-10"
              >
                Upload
              </button>
            </div>
          </form>
          {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
        </div>
        <div className="bw-card p-6">
          <h2 className="font-medium mb-3">Bulk Upload (Multi-file)</h2>
          <FileUploadQueue />
        </div>
      </div>
    </div>
  );
}
