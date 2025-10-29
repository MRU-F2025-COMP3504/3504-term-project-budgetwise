import Table from "../components/Table";

export default function StatementsPage({ statements }) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "statement_name", label: "Name" },
    { key: "period_start", label: "Start" },
    { key: "period_end", label: "End" },
    { key: "created_at", label: "Uploaded" },
  ];

  return (
    <div className="bw-container">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Statements</h1>
          <p className="bw-text-muted">Browse your uploaded statements.</p>
        </div>
      </header>

      <Table columns={columns} rows={statements ?? []} emptyText="No statements found." />
    </div>
  );
}
