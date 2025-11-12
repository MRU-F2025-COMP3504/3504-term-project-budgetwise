"use client";
import { useState, useMemo } from "react";
import Table from "../components/Table";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", monthlyBudget: "" });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const category = {
      id: String(Date.now()),
      name: newCategory.name.trim(),
      monthlyBudget: Number(newCategory.monthlyBudget) || 0
    };
    
    setCategories(prev => [...prev, category]);
    setNewCategory({ name: "", monthlyBudget: "" });
  };

  const updateCategoryBudget = (categoryId, newBudget) => {
    setCategories(prev => 
      prev.map(category =>
        category.id === categoryId 
          ? { ...category, monthlyBudget: Number(newBudget) || 0 }
          : category
      )
    );
  };

  const updateField = (field, value) => {
    setNewCategory(prev => ({ ...prev, [field]: value }));
  };

  const tableRows = useMemo(() => categories, [categories]);

  return (
    <div className="bw-container">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>
      
      <div className="bw-card p-4 mb-6 space-y-3">
        <h2 className="font-medium">Add Category</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            value={newCategory.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Name"
            className="bw-input flex-1"
          />
          <input
            value={newCategory.monthlyBudget}
            onChange={(e) => updateField("monthlyBudget", e.target.value)}
            placeholder="Monthly Budget (CAD)"
            type="number"
            className="bw-input w-44"
          />
          <button
            onClick={handleAddCategory}
            className="bw-btn bw-btn-primary"
          >
            Add
          </button>
        </div>
      </div>

      <Table
        rows={tableRows}
        columns={[
          { key: "name", label: "Name" },
          {
            key: "monthlyBudget",
            label: "Monthly Budget",
            render: (value, row) => (
              <input
                type="number"
                className="bg-transparent w-28 text-right font-mono"
                value={row.monthlyBudget}
                onChange={(e) => updateCategoryBudget(row.id, e.target.value)}
              />
            )
          }
        ]}
        emptyText="No categories yet. Add one to get started!"
      />
    </div>
  );
}
