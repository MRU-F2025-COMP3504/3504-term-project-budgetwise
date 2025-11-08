"use client";
import { useState } from "react";

function Progress({ value, target }) {
  const pct = target > 0 ? Math.min(100, Math.round(Math.abs(value) / target * 100)) : 0;
  const over = Math.abs(value) > target;
  return (
    <div className="space-y-1">
      <div className="h-2 rounded bg-white/10 overflow-hidden">
        <div
          style={{ width: `${pct}%` }}
          className={`h-full ${over ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-accent-2)]'}`}
        />
      </div>
      <p className="text-[10px] font-mono">
        {new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(value)} / {new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(target)} ({pct}%)
      </p>
    </div>
  );
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([
    { id: "1", category: "Groceries", limit: 400, spent: -220 },
    { id: "2", category: "Dining", limit: 150, spent: -180 },
    { id: "3", category: "Transit", limit: 120, spent: -35 }
  ]);

  const [form, setForm] = useState({ category: "", limit: "" });

  const add = e => {
    e.preventDefault();
    if (!form.category.trim()) return;
    setBudgets(b => [...b, {
      id: String(Date.now()),
      category: form.category.trim(),
      limit: Number(form.limit) || 0,
      spent: 0
    }]);
    setForm({ category: "", limit: "" });
  };

  return (
    <div className="bw-container">
      <h1 className="text-2xl font-semibold mb-4">Budgets</h1>
      <form onSubmit={add} className="bw-card p-4 mb-6 flex gap-2 flex-wrap">
        <input
          className="bw-input flex-1"
          placeholder="Category"
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
        />
        <input
          className="bw-input w-40"
          type="number"
          placeholder="Monthly Limit"
          value={form.limit}
          onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
        />
        <button className="px-4 py-2 rounded-md bg-[var(--color-accent)] text-black">
          Add Budget
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-3">
        {budgets.map(b => {
          const over = Math.abs(b.spent) > b.limit;
          return (
            <div key={b.id} className="bw-card p-4 space-y-2">
              <h2 className="font-medium">{b.category}</h2>
              <Progress value={b.spent} target={b.limit} />
              {over && <p className="text-[10px] text-[var(--color-danger)]">Over limit!</p>}
            </div>
          );
        })}
        {budgets.length === 0 && <p className="text-[var(--color-text-muted)]">No budgets yet.</p>}
      </div>
    </div>
  );
}
