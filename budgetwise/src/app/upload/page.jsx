"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import Table from "@/components/Table";

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([]); // File[]
  const [uploadResults, setUploadResults] = useState({}); // { [fileName]: { status, message } }
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statements, setStatements] = useState([]);

  // 1. Fetch Existing Statements
  // We want to show the user what they've already uploaded.
  const fetchStatements = async () => {
    try {
      const { data } = await api.statements.list();
      setStatements(data?.statements || []);
    } catch (e) {
      console.error("Failed to load statements", e);
    }
  };

  useEffect(() => {
    fetchStatements();
  }, []);

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setStatusMessage("");

    // Initialize results for each file so we can show a status indicator
    const initialResults = {};
    files.forEach((file) => {
      initialResults[file.name] = {
        status: "pending",
        message: "Ready to upload",
      };
    });
    setUploadResults(initialResults);
  };

  // 2. Upload Files
  // We loop through each selected file and send it to the server one by one.
  const uploadAllFiles = async (filesToUpload = selectedFiles) => {
    if (!filesToUpload.length) {
      setStatusMessage("Please choose at least one CSV file.");
      return;
    }

    setIsUploading(true);
    const newResults = { ...uploadResults };

    for (const file of filesToUpload) {
      // Update status to "Uploading..."
      newResults[file.name] = { status: "uploading", message: "Uploading..." };
      setUploadResults({ ...newResults });

      const formData = new FormData();
      formData.append("file", file);

      try {
        // Send to API
        const { data } = await api.statements.upload(formData);
        newResults[file.name] = {
          status: "ok",
          message: `✅ Uploaded: ${data.file || file.name}`,
        };
      } catch (err) {
        newResults[file.name] = {
          status: "error",
          message: `❌ Failed: ${err.message}`,
        };
      }

      // Update UI with result
      setUploadResults({ ...newResults });
    }

    setIsUploading(false);

    // Check if everything went well
    const allSuccessful = Object.values(newResults).every(
      (result) => result.status === "ok"
    );
    setStatusMessage(
      allSuccessful
        ? `✅ All ${filesToUpload.length} file(s) uploaded successfully.`
        : `ℹ️ Upload finished. Review results below.`
    );

    if (allSuccessful) {
      fetchStatements();
    }
  };

  const uploadSingleFile = async (file) => {
    await uploadAllFiles([file]);
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024).toFixed(1) + " KB";
  };

  const columns = [
    {
      key: "created_at",
      label: "Created At",
      render: (val) => {
        if (!val) return "-";
        return new Date(val).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
      },
    },
    { key: "file_name", label: "File Name" },
  ];

  return (
    <div className="bw-container py-8">
      <h1 className="text-2xl font-semibold mb-2">Upload CSV Files</h1>
      <p className="bw-text-muted text-sm mb-6 max-w-prose">
        Choose one or multiple bank statement CSV files. Each file will be
        processed and categorized automatically.
      </p>

      <div className="bw-card p-6 flex flex-col mb-8">
        <h2 className="font-medium mb-3">Choose Files</h2>

        <div className="border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-xl p-5 w-full flex flex-col gap-4">
          <label
            className="text-xs uppercase tracking-wide font-semibold opacity-80"
            htmlFor="file-input"
          >
            Choose CSV File(s)
          </label>

          <input
            id="file-input"
            type="file"
            name="files"
            accept=".csv"
            multiple
            onChange={handleFileSelection}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[var(--color-surface-2)] file:text-[var(--color-text)] file:cursor-pointer file:hover:bg-[var(--color-surface)] file:transition"
            aria-label="Select one or more CSV statement files"
          />

          {selectedFiles.length > 0 && (
            <div className="text-xs bw-text-muted space-y-1">
              <p className="font-semibold">
                Selected ({selectedFiles.length}):
              </p>
              <ul className="list-disc list-inside space-y-0">
                {selectedFiles.map((file) => (
                  <li
                    key={file.name}
                    className="flex justify-between items-center gap-2"
                  >
                    <span className="truncate max-w-[60%]" title={file.name}>
                      {file.name}
                    </span>
                    <span className="text-[10px] opacity-70">
                      {formatFileSize(file.size)}
                    </span>
                    {uploadResults[file.name]?.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => uploadSingleFile(file)}
                        disabled={isUploading}
                        className="text-[10px] underline hover:no-underline"
                        aria-label={`Upload file ${file.name}`}
                      >
                        Upload
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <button
              type="button"
              onClick={() => uploadAllFiles()}
              disabled={isUploading}
              className="bw-btn bw-btn-primary bw-btn-block"
              aria-label={
                isUploading
                  ? "Uploading files"
                  : `Upload ${selectedFiles.length} file(s)`
              }
            >
              {isUploading
                ? "Uploading..."
                : selectedFiles.length === 1
                  ? "Upload File"
                  : `Upload All (${selectedFiles.length})`}
            </button>
          )}
        </div>

        {/* Upload Results */}
        <div className="mt-4 space-y-2 text-xs">
          {Object.keys(uploadResults).map((fileName) => (
            <div key={fileName} className="bw-card p-2 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <strong className="truncate max-w-[65%]" title={fileName}>
                  {fileName}
                </strong>
                <span
                  className={`text-[10px] ${
                    uploadResults[fileName].status === "ok"
                      ? "text-[var(--color-success)]"
                      : uploadResults[fileName].status === "error"
                        ? "text-[var(--color-danger)]"
                        : "opacity-60"
                  }`}
                >
                  {uploadResults[fileName].status}
                </span>
              </div>
              <span>{uploadResults[fileName].message}</span>
            </div>
          ))}

          {!selectedFiles.length && (
            <p className="text-[var(--color-text-muted)]">
              No files selected yet.
            </p>
          )}
        </div>

        {statusMessage && (
          <p
            className={`mt-4 text-center text-sm ${
              statusMessage.startsWith("✅")
                ? "text-[var(--color-success)]"
                : statusMessage.startsWith("❌")
                  ? "text-[var(--color-danger)]"
                  : "opacity-80"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </div>

      {/* Statements Table */}
      <h2 className="text-lg font-semibold mb-3">Uploaded Statements</h2>
      <Table
        rows={statements}
        columns={columns}
        emptyText="No statements uploaded yet."
      />
    </div>
  );
}
