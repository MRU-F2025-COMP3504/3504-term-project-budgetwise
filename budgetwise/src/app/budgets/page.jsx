"use client";
import { useState } from "react";

/**
 * Progress bar component for budget visualization
 * Shows how much you've spent vs your limit.
 */
function BudgetProgress({ spent, limit }) {
  // Calculate percentage, capping at 100% for the bar width
  const percentage =
    limit > 0 ? Math.min(100, Math.round((Math.abs(spent) / limit) * 100)) : 0;
  const isOverBudget = Math.abs(spent) > limit;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  return (
    <div className="space-y-1">
      <div className="h-2 rounded bg-white/10 overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full ${isOverBudget ? "bg-[var(--color-danger)]" : "bg-[var(--color-accent-2)]"}`}
        />
      </div>
      <p className="text-[10px] font-mono">
        {formatCurrency(spent)} / {formatCurrency(limit)} ({percentage}%)
      </p>
    </div>
  );
}

export default function BudgetsPage() {
  // 1. State Management
  // We keep track of the list of budgets and the form data for adding a new one.
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: "", limit: "" });

  const handleAddBudget = (e) => {
    e.preventDefault();

    if (!newBudget.category.trim()) return;

    // 2. Create New Budget
    // We make a simple object to represent the budget and add it to our list.
    const budget = {
      id: String(Date.now()),
      category: newBudget.category.trim(),
      limit: Number(newBudget.limit) || 0,
      spent: 0, // In a real app, we'd calculate this from transactions
    };

    setBudgets((prev) => [...prev, budget]);
    setNewBudget({ category: "", limit: "" });
  };

  const updateField = (field, value) => {
    setNewBudget((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bw-container">
      <h1 className="text-2xl font-semibold mb-4">Budgets</h1>

      <form
        onSubmit={handleAddBudget}
        className="bw-card p-4 mb-6 flex gap-2 flex-wrap"
      >
        <input
          className="bw-input flex-1"
          placeholder="Category"
          value={newBudget.category}
          onChange={(e) => updateField("category", e.target.value)}
        />
        <input
          className="bw-input w-40"
          type="number"
          placeholder="Monthly Limit"
          value={newBudget.limit}
          onChange={(e) => updateField("limit", e.target.value)}
        />
        <button className="bw-btn bw-btn-accent">Add Budget</button>
      </form>

      <div className="grid gap-4 md:grid-cols-3">
        {budgets.map((budget) => {
          const isOverBudget = Math.abs(budget.spent) > budget.limit;

          return (
            <div key={budget.id} className="bw-card p-4 space-y-2">
              <h2 className="font-medium">{budget.category}</h2>
              <BudgetProgress spent={budget.spent} limit={budget.limit} />
              {isOverBudget && (
                <p className="text-[10px] text-[var(--color-danger)]">
                  Over limit!
                </p>
              )}
            </div>
          );
        })}

        {budgets.length === 0 && (
          <p className="text-[var(--color-text-muted)]">
            No budgets yet. Add one to get started!
          </p>
        )}
      </div>
    </div>
  );
}
