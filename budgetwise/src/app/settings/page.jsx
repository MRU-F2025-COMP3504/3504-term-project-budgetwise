"use client";
import { useState, useEffect } from "react";
import { Save, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import api from "@/services/api";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    monthlyIncome: "",
    monthlyBudget: "",
    savingsGoal: "",
    financialGoals: "",
    experienceLevel: "Medium",
  });

  // 1. Load Existing Profile
  // We want to pre-fill the form with the user's current data so they don't have to type everything again.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.profile.get();
        if (data?.profile) {
          setFormData({
            monthlyIncome: data.profile.monthlyIncome || "",
            monthlyBudget: data.profile.monthlyBudget || "",
            savingsGoal: data.profile.savingsGoal || "",
            financialGoals: data.profile.financialGoals || "",
            experienceLevel: data.profile.experienceLevel || "Medium",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        // If loading fails, we just let them start with a blank form.
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // 2. Update Profile & Regenerate Insights
      // We send the new data to our special API endpoint.
      // This endpoint saves the data AND asks the AI to create new insights based on the changes.
      const res = await fetch("/api/user_profile/update_insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: formData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update profile");
      }

      setSuccess(true);
      // We hide the success message after a few seconds to keep the UI clean.
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="bw-container py-8 flex justify-center">
        <RefreshCw className="animate-spin text-[var(--color-text-muted)]" />
      </div>
    );
  }

  return (
    <div className="bw-container py-8 px-0 md:px-5">
      <header className="mb-8 px-4 md:px-0">
        <h1 className="text-3xl font-semibold text-[var(--color-text)]">
          Settings
        </h1>
        <p className="mt-1 text-[var(--color-text-muted)]">
          Update your financial data to regenerate your AI insights.
        </p>
      </header>

      <div className="px-4 md:px-0 max-w-2xl">
        <form onSubmit={handleSubmit} className="bw-card p-6 space-y-6">
          {/* Success/Error Messages */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
              <CheckCircle size={20} />
              <span>Profile updated and insights regenerated!</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">
                Monthly Income ($)
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">
                Monthly Budget ($)
              </label>
              <input
                type="number"
                name="monthlyBudget"
                value={formData.monthlyBudget}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">
                Savings Goal ($)
              </label>
              <input
                type="number"
                name="savingsGoal"
                value={formData.savingsGoal}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors"
              >
                <option value="Low">Beginner</option>
                <option value="Medium">Intermediate</option>
                <option value="High">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--color-text-muted)]">
              Financial Goals
            </label>
            <textarea
              name="financialGoals"
              value={formData.financialGoals}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--color-border)] focus:border-[var(--color-primary)] outline-none transition-colors resize-none"
              placeholder="e.g. Save for a house, pay off debt..."
            />
          </div>

          <div className="pt-4 border-t border-[var(--color-border)]">
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto px-6 py-3 rounded-lg bg-[var(--buttoncolor1)] hover:opacity-90 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Regenerating Insights...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save & Update Insights
                </>
              )}
            </button>
            <p className="text-xs text-center md:text-left mt-3 text-[var(--color-text-muted)]">
              This will use AI to analyze your new data and update your profile
              summary.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
