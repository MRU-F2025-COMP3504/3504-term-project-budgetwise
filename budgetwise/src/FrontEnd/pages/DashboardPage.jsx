import CategoryChart from "../components/CategoryChart"; 

"use client";
import { useEffect, useState } from "react";
import StatSummary from "../components/StatSummary";
import Table from "../components/Table";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json().catch(()=>({}));
        if (!ignore) setTransactions(data.Transactions || []);
      } catch {
        if (!ignore) setTransactions([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const total = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const outflow = transactions.filter(t => Number(t.amount) < 0)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const inflow = transactions.filter(t => Number(t.amount) > 0)
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const categories = transactions.reduce((map, t) => {
    const c = t.category || "Uncategorized";
    map[c] = (map[c] || 0) + (Number(t.amount) || 0);
    return map;
  }, {});
  const topCats = Object.entries(categories)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 5);

  const fmt = (n) => new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(n);
  const stats = [
    { label: "Net Flow", value: fmt(total) },
    { label: "Total Inflow", value: fmt(inflow) },
    { label: "Total Outflow", value: fmt(outflow) },
    { label: "Categories", value: Object.keys(categories).length }
  ];

  return (
    <div className="bw-container">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <StatSummary stats={stats} />
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="bw-card p-4">
          <h2 className="font-medium mb-2">Top Categories</h2>

          {/* 🔹 Add chart visualization */}
          <CategoryChart data={topCats} />

          <ul className="text-sm space-y-1 mt-4">
            {topCats.map(([c, amt]) => (
              <li key={c} className="flex justify-between">
                <span>{c}</span>
                <span className={amt < 0 ? "text-[var(--color-danger)] font-mono" : "font-mono"}>
                  {fmt(amt)}
                </span>
              </li>
            ))}
            {topCats.length === 0 && <li className="text-[var(--color-text-muted)]">No data</li>}
          </ul>
        </div>
        <div className="bw-card p-4">
          <h2 className="font-medium mb-2">Recent Transactions</h2>
          <Table
            rows={transactions.slice(0, 8)}
            columns={[
              { key: "transaction_date", label: "Date" },
              { key: "description", label: "Description" },
              { key: "amount", label: "Amount" },
              { key: "category", label: "Category" }
            ]}
            emptyText="None"
          />
        </div>
      </div>
      {loading && <p className="text-xs mt-4 text-[var(--color-text-muted)]">Loading...</p>}
    </div>
  );
}
