"use client";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import api from "@/services/api";

export default function StatementsPage({ statements }) {
  const [rows, setRows] = useState(Array.isArray(statements) ? statements : []);
  const [loading, setLoading] = useState(!Array.isArray(statements));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (statements === undefined) {
      (async () => {
        try {
          const { data } = await api.statements.list();
          setRows(data?.statements || []);
        } catch (e) {
          console.error('Failed to load statements:', e);
          setError(e.message || 'Failed to load statements');
          setRows([]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [statements]);

  return (
    <div className="bw-container">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Statements</h1>
        <p className="bw-text-muted">Browse your uploaded bank statements.</p>
      </header>

      {error && (
        <p className="text-sm text-[var(--color-danger)] mb-2">{error}</p>
      )}
      {loading && (
        <p className="text-xs text-[var(--color-text-muted)] mb-2">Loading statements...</p>
      )}
      <Table
        rows={rows}
        emptyText="No statements found. Upload a CSV file to get started!"
      />
    </div>
  );
}
