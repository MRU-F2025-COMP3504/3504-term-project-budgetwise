"use client";
import Table from "../components/Table";

export default function StatementsPage({ statements = [] }) {
  return (
    <div className="bw-container">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Statements</h1>
        <p className="bw-text-muted">Browse your uploaded bank statements.</p>
      </header>

      <Table 
        rows={statements} 
        emptyText="No statements found. Upload a CSV file to get started!" 
      />
    </div>
  );
}
