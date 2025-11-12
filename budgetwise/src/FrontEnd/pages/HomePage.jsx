"use client";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div style={{ color: 'var(--textcolor3)' }}>Loading...</div>
      </div>
    );
  }

  // Signed in - utility dashboard
  if (user) {
    // Get the user's name from user_metadata (set during registration)
    // If display_name exists, extract just the first name
    // Otherwise fall back to first part of email or 'there'
    const fullName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'there';
    const firstName = fullName.split(' ')[0];
    
    return (
      <div className="bw-container">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold" style={{ color: 'var(--textcolor1)' }}>
            Hi, {firstName}!
          </h1>
          <p className="mt-2" style={{ color: 'var(--textcolor3)' }}>
            Your financial command center
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Upload */}
          <Link href="/upload" className="bw-card p-6 hover:shadow-lg transition-shadow" style={{ boxShadow: '0 0 20px rgba(91, 75, 138, 0.15)' }}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--textcolor1)' }}>Upload</h2>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--buttoncolor1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }}>↑</div>
            </div>
            <p style={{ color: 'var(--textcolor3)', fontSize: '0.875rem' }}>
              Upload bank statements or CSV files to track your spending
            </p>
          </Link>

          {/* Statements */}
          <Link href="/statements" className="bw-card p-6 hover:shadow-lg transition-shadow" style={{ boxShadow: '0 0 20px rgba(91, 75, 138, 0.15)' }}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--textcolor1)' }}>Statements</h2>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--buttoncolor1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }}>≡</div>
            </div>
            <p style={{ color: 'var(--textcolor3)', fontSize: '0.875rem' }}>
              View and manage all your uploaded statements
            </p>
          </Link>

          {/* Transactions */}
          <Link href="/transactions" className="bw-card p-6 hover:shadow-lg transition-shadow" style={{ boxShadow: '0 0 20px rgba(91, 75, 138, 0.15)' }}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--textcolor1)' }}>Transactions</h2>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--buttoncolor2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white' }}>$</div>
            </div>
            <p style={{ color: 'var(--textcolor3)', fontSize: '0.875rem' }}>
              Browse and categorize all your transactions
            </p>
          </Link>

          {/* Categories */}
          <Link href="/categories" className="bw-card p-6 hover:shadow-lg transition-shadow" style={{ boxShadow: '0 0 20px rgba(61, 125, 107, 0.15)' }}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--textcolor1)' }}>Categories</h2>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--buttoncolor3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }}>#</div>
            </div>
            <p style={{ color: 'var(--textcolor3)', fontSize: '0.875rem' }}>
              Organize spending into custom categories
            </p>
          </Link>

          {/* Budgets */}
          <Link href="/budgets" className="bw-card p-6 hover:shadow-lg transition-shadow" style={{ boxShadow: '0 0 20px rgba(61, 125, 107, 0.15)' }}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--textcolor1)' }}>Budgets</h2>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', fontWeight: 'bold' }}>%</div>
            </div>
            <p style={{ color: 'var(--textcolor3)', fontSize: '0.875rem' }}>
              Set spending limits and track your progress
            </p>
          </Link>

          {/* AI Assistant - Coming Soon */}
          <div className="bw-card p-6 opacity-60" style={{ boxShadow: '0 0 20px rgba(91, 75, 138, 0.1)' }}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--textcolor2)' }}>AI Assistant</h2>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--surface-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--textcolor3)', fontWeight: 'bold' }}>AI</div>
            </div>
            <p style={{ color: 'var(--textcolor3)', fontSize: '0.875rem' }}>
              Get personalized insights and advice (Coming Soon)
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bw-card p-6" style={{ background: 'var(--surface-raised)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--textcolor2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Access
          </h3>
          <div className="flex gap-3 flex-wrap">
            <Link href="/dashboard" className="bw-btn bw-btn-primary">
              Dashboard
            </Link>
            <Link href="/upload" className="bw-btn bw-btn-accent">
              Upload Statement
            </Link>
            <Link href="/profile" className="bw-btn bw-btn-neutral">
              Profile Settings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Not signed in - landing page
  return (
    <div className="min-h-[80vh]">
      {/* Hero Section */}
      <div className="bw-container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--textcolor1)', lineHeight: '1.2' }}>
            Take Control of Your Spending
          </h1>
          <p className="text-lg md:text-xl mb-8" style={{ color: 'var(--textcolor2)', lineHeight: '1.6' }}>
            Upload bank statements, categorize transactions, and understand where your money goes. 
            No bank connections required.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="bw-btn bw-btn-primary text-base px-8 py-3">
              Get Started
            </Link>
            <Link href="/login" className="bw-btn bw-btn-neutral text-base px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bw-container py-12">
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="bw-card p-8 text-center" style={{ boxShadow: '0 0 30px rgba(91, 75, 138, 0.2)' }}>
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--textcolor1)' }}>
              Smart Categorization
            </h3>
            <p style={{ color: 'var(--textcolor3)' }}>
              Automatically organize transactions into meaningful categories
            </p>
          </div>

          <div className="bw-card p-8 text-center" style={{ boxShadow: '0 0 30px rgba(61, 125, 107, 0.2)' }}>
            <div className="mb-4 text-4xl">🔒</div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--textcolor1)' }}>
              Privacy First
            </h3>
            <p style={{ color: 'var(--textcolor3)' }}>
              Your data stays private. No bank linking, just simple uploads
            </p>
          </div>

          <div className="bw-card p-8 text-center" style={{ boxShadow: '0 0 30px rgba(182, 139, 60, 0.2)' }}>
            <div className="mb-4 text-4xl">💡</div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--textcolor1)' }}>
              Clear Insights
            </h3>
            <p style={{ color: 'var(--textcolor3)' }}>
              Understand your spending patterns with visual dashboards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
