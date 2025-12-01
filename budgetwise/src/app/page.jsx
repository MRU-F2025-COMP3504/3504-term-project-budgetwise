"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import CardLink from "@/components/CardLink";
import FeatureCard from "@/components/FeatureCard";
import QuickAccess from "@/components/QuickAccess";
import { dashboardCards, featureCards, quickLinks } from "@/components/config/homeData";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div style={{ color: 'var(--textcolor3)' }}>Loading...</div>
      </div>
    );
  }

  // Signed in - redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[var(--color-text-muted)] animate-pulse">Redirecting to Dashboard...</div>
      </div>
    );
  }

  // Not signed in - landing page
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] -z-10 opacity-50" />
      
      {/* Hero Section */}
      <div className="bw-container py-20 md:py-32 text-center relative z-10">
        <div className="flex justify-center mb-8">
           <img src="/BudgetWiseLogo.png" alt="BudgetWise Logo" className="h-20 w-auto" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-[var(--surface-raised)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-primary)] shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Smart Financial Tracking
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
          Master Your Money <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Without the Stress
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-[var(--color-text-secondary)] leading-relaxed">
          Upload statements, track expenses, and get AI-powered insights. 
          <span className="block mt-2 text-[var(--color-text-muted)] text-lg">No bank connections required. Completely private.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            href="/register" 
            className="bw-btn bw-btn-primary text-lg px-10 py-4 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 font-semibold"
          >
            Start for Free
          </Link>
          <Link 
            href="/login" 
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] font-medium px-6 py-3 transition-colors flex items-center gap-2"
          >
            Already have an account? <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Features Grid - Modernized */}
      <div className="bw-container py-24 border-t border-[var(--color-border)]">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {featureCards.map((f) => (
            <div key={f.title} className="bw-card p-8 hover:-translate-y-2 transition-transform duration-300 group border border-[var(--color-border)] hover:border-[var(--color-primary)]/30">
              <div className="text-4xl mb-6 bg-[var(--surface-raised)] w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                {f.emoji}
              </div>
              <h3 className="text-xl font-bold mb-3 text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{f.title}</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
