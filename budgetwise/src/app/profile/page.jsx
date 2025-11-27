"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      <div className="bw-container">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bw-container">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="bw-card p-4 bg-red-900/20 border-red-500/30">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bw-container">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="bw-card p-4">
          <p className="text-[var(--color-text-muted)]">No profile data found.</p>
          <p className="text-xs mt-2 text-[var(--color-text-muted)]">
            Complete the quiz to create your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bw-container">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      
      <div className="space-y-4">
        {/* Personal Information */}
        {profile.name && (
          <div className="bw-card p-4">
            <h2 className="font-medium text-lg mb-3">Personal Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Name:</span>
                <span className="font-medium">{profile.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Financial Goals */}
        {profile.financialGoals && (
          <div className="bw-card p-4">
            <h2 className="font-medium text-lg mb-3">Financial Goals</h2>
            <p className="text-sm">{profile.financialGoals}</p>
          </div>
        )}

        {/* Spending Habits */}
        {profile.spendingHabits && (
          <div className="bw-card p-4">
            <h2 className="font-medium text-lg mb-3">Spending Habits</h2>
            <p className="text-sm">{profile.spendingHabits}</p>
          </div>
        )}

        {/* Risk Profile */}
        {profile.riskProfile && (
          <div className="bw-card p-4">
            <h2 className="font-medium text-lg mb-3">Risk Profile</h2>
            <p className="text-sm capitalize">{profile.riskProfile}</p>
          </div>
        )}

        {/* All Profile Data (for debugging/completeness) */}
        <details className="bw-card p-4">
          <summary className="cursor-pointer font-medium text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            View Raw Profile Data
          </summary>
          <pre className="mt-3 text-xs overflow-auto p-3 bg-[var(--color-surface-2)] rounded">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </details>
      </div>

      <p className="text-xs mt-6 text-[var(--color-text-muted)]">
        Future: editable preferences, goals, risk profile, quiz answers normalization.
      </p>
    </div>
  );
}
