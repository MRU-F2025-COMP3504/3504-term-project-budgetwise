import Table from "../components/Table";

export default function TransactionsPage({ transactions }) {
  const currency = (n) => {
    const num = Number(n);
    return isNaN(num) ? "-" : num.toLocaleString(undefined, { style: "currency", currency: "USD" });
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "date", label: "Date" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "amount", label: "Amount", render: (v) => currency(v) },
  ];

  return (
    <div className="bw-container">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="bw-text-muted">All your parsed and categorized transactions.</p>
      </header>

      <Table columns={columns} rows={transactions ?? []} emptyText="No transactions found." />
    </div>
  );
}
