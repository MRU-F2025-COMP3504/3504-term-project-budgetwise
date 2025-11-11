"use client";
import { useState, useMemo } from "react";
import Table from "../components/Table";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: "1", name: "Groceries", monthlyBudget: 400 },
    { id: "2", name: "Dining", monthlyBudget: 150 },
    { id: "3", name: "Transit", monthlyBudget: 120 }
  ]);
  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState("");

  const add = () => {
    if (!newName.trim()) return;
    setCategories(c => [...c, {
      id: String(Date.now()),
      name: newName.trim(),
      monthlyBudget: Number(newBudget) || 0
    }]);
    setNewName(""); setNewBudget("");
  };

  const updateBudget = (id, value) => {
    setCategories(c => c.map(cat =>
      cat.id === id ? { ...cat, monthlyBudget: Number(value) || 0 } : cat
    ));
  };

  const tableRows = useMemo(() => categories, [categories]);

  return (
    <div className="bw-container">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>
      <div className="bw-card p-4 mb-6 space-y-3">
        <h2 className="font-medium">Add Category</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Name"
            className="bw-input flex-1"
          />
          <input
            value={newBudget}
            onChange={e => setNewBudget(e.target.value)}
            placeholder="Monthly Budget (CAD)"
            type="number"
            className="bw-input w-44"
          />
          <button
            onClick={add}
            className="bw-btn bw-btn-primary"
          >Add</button>
        </div>
      </div>

      <Table
        rows={tableRows}
        columns={[
          { key: "name", label: "Name" },
          {
            key: "monthlyBudget",
            label: "Monthly Budget",
            render: (v, row) => (
              <input
                type="number"
                className="bg-transparent w-28 text-right font-mono"
                value={row.monthlyBudget}
                onChange={e => updateBudget(row.id, e.target.value)}
              />
            )
          }
        ]}
        emptyText="No categories."
      />
    </div>
  );
}
