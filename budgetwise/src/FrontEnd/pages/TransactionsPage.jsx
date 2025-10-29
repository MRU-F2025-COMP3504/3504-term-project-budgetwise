import Table from "../components/Table";

export default function TransactionsPage({ transactions }) {
  return (
    <div className="bw-container">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="bw-text-muted">All your parsed and categorized transactions.</p>
      </header>

      {/* No columns passed -> Table will show ALL fields dynamically */}
      <Table rows={transactions ?? []} emptyText="No transactions found." />
    </div>
  );
}
