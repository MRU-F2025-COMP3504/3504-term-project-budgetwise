import Table from "../components/Table";

export default function StatementsPage({ statements }) {
  return (
    <div className="bw-container">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Statements</h1>
          <p className="bw-text-muted">Browse your uploaded statements.</p>
        </div>
      </header>

      {/* No columns passed -> Table will show ALL fields dynamically */}
      <Table rows={statements ?? []} emptyText="No statements found." />
    </div>
  );
}
