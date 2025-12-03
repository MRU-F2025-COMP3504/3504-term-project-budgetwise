"use client";
"use client";
import { PersonalizedForYouPanel } from "@/components/QuickAccess";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import StatSummary from "@/components/StatSummary";
import Table from "@/components/Table";
import api from "@/services/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user name
  const fullName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'there';
  const firstName = fullName.split(' ')[0];

  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;
    
    const fetchTransactions = async () => {
      try {
        const { data } = await api.transactions.list();
        if (isMounted) {
          setTransactions(data.transactions || []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        if (isMounted) {
          setTransactions([]);
          setLoading(false);
        }
      }
    };
    
    fetchTransactions();
    return () => { isMounted = false; };
  }, []);

  // Calculate financial totals
  const totalNetFlow = transactions.reduce((sum, transaction) => {
    return sum + (Number(transaction.amount) || 0);
  }, 0);
  
  const totalOutflow = transactions
    .filter(transaction => Number(transaction.amount) < 0)
    .reduce((sum, transaction) => sum + (Number(transaction.amount) || 0), 0);
  
  const totalInflow = transactions
    .filter(transaction => Number(transaction.amount) > 0)
    .reduce((sum, transaction) => sum + (Number(transaction.amount) || 0), 0);

  // Group transactions by category
  const categorizedAmounts = transactions.reduce((categoryMap, transaction) => {
    const category = transaction.category || "Uncategorized";
    categoryMap[category] = (categoryMap[category] || 0) + (Number(transaction.amount) || 0);
    return categoryMap;
  }, {});
  
  const topCategories = Object.entries(categorizedAmounts)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const stats = [
    { label: "Net Flow", value: formatCurrency(totalNetFlow) },
    { label: "Total Inflow", value: formatCurrency(totalInflow) },
    { label: "Total Outflow", value: formatCurrency(totalOutflow) },
    { label: "Categories", value: Object.keys(categorizedAmounts).length }
  ];

  return (
    <div className="bw-container py-8 px-0 md:px-5">
      <header className="mb-8 px-4 md:px-0">
        <h1 className="text-3xl font-semibold text-[var(--color-text)]">
          Hi, {firstName}!
        </h1>
        <p className="mt-1 text-[var(--color-text-muted)]">
          Your financial command center
        </p>
      </header>

      <div className="px-4 md:px-0">
        <StatSummary stats={stats} />
      </div>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2 mb-8 px-4 md:px-0">
        {/* Top Categories Card */}
        <div className="bw-card p-4 min-w-0">
          <h2 className="font-medium mb-2">Top Categories</h2>
          <ul className="text-sm space-y-1">
            {topCategories.map(([category, amount]) => (
              <li key={category} className="flex justify-between">
                <span>{category}</span>
                <span className={amount < 0 ? "text-[var(--color-danger)] font-mono" : "font-mono"}>
                  {formatCurrency(amount)}
                </span>
              </li>
            ))}
            {topCategories.length === 0 && (
              <li className="text-[var(--color-text-muted)]">No data available</li>
            )}
          </ul>
        </div>
        
        {/* Recent Transactions Card */}
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
            emptyText="No transactions yet"
          />
        </div>
      </div>
      <PersonalizedForYouPanel />
      
      {loading && (
        <p className="text-xs mt-4 text-[var(--color-text-muted)]">Loading transactions...</p>
      )}
    </div>
  );
}
