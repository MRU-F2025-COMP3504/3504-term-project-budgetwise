"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "N/A";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    
    const fetchProfile = async () => {
      try {
        const { data } = await api.profile.get();
        if (isMounted) {
          setProfile(data.profile || null);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setProfile(null);
          setError(err.message);
          setLoading(false);
        }
      }
    };
    
    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="bw-container flex justify-center items-center h-[50vh]">
        <p className="text-[var(--color-text-muted)] animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bw-container">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="bw-card p-4 bg-red-500/10 border border-red-500/20 text-red-400">
          <p>Error loading profile: {error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bw-container">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="bw-card p-8 text-center">
          <p className="text-[var(--color-text-muted)] mb-4">No profile data found.</p>
          <a href="/quiz" className="bw-btn bw-btn-primary">Take the Quiz</a>
        </div>
      </div>
    );
  }

  const { 
    name, 
    monthlyIncome, 
    monthlyBudget, 
    savingsGoal, 
    financialGoals, 
    insights, 
    experienceLevel, 
    summary 
  } = profile;

  return (
    <div className="bw-container max-w-5xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Financial Profile</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Overview for <span className="font-medium text-[var(--color-text)]">{name}</span>
          </p>
        </div>
        {experienceLevel && (
          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--surface-raised)] border border-[var(--color-border)]">
            {experienceLevel} Level
          </span>
        )}
      </header>
      
      {/* Summary Section */}
      {summary && (
        <div className="bw-card p-6 mb-8 border-l-4 border-l-[var(--color-primary)]">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span>📝</span> Executive Summary
          </h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <MetricCard 
          label="Monthly Income" 
          value={formatCurrency(monthlyIncome)} 
          icon="💰" 
          color="text-emerald-400"
        />
        <MetricCard 
          label="Monthly Budget" 
          value={formatCurrency(monthlyBudget)} 
          icon="📉" 
          color="text-blue-400"
        />
        <MetricCard 
          label="Savings Goal" 
          value={formatCurrency(savingsGoal)} 
          icon="🎯" 
          color="text-purple-400"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Insights */}
        <div className="lg:col-span-2 space-y-6">
          {insights && insights.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>💡</span> AI Insights
              </h2>
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className="bw-card p-4 flex gap-4 items-start hover:bg-[var(--surface-raised)] transition-colors">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                    <p className="text-[var(--color-text-secondary)]">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Goals & Details */}
        <div className="space-y-6">
          <div className="bw-card p-5">
            <h2 className="font-semibold mb-4 text-[var(--color-text-muted)] uppercase text-xs tracking-wider">
              Primary Goal
            </h2>
            <p className="text-lg font-medium">{financialGoals || "Not set"}</p>
          </div>

          {/* Raw Data Toggle */}
          <details className="group">
            <summary className="cursor-pointer text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-2 select-none">
              <span className="group-open:rotate-90 transition-transform">▶</span>
              View Raw Data
            </summary>
            <div className="mt-2">
              <pre className="text-[10px] p-3 rounded bg-black/30 overflow-auto max-h-60 border border-[var(--color-border)]">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color }) {
  return (
    <div className="bw-card p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-200">
      <div className="text-3xl bg-[var(--surface-raised)] w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm text-[var(--color-text-muted)] font-medium mb-0.5">{label}</p>
        <p className={`text-2xl font-bold ${color || 'text-[var(--color-text)]'}`}>{value}</p>
      </div>
    </div>
  );
}
