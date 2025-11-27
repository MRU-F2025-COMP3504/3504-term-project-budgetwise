"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import CardLink from "@/components/CardLink";
import FeatureCard from "@/components/FeatureCard";
import QuickAccess from "@/components/QuickAccess";
import { dashboardCards, featureCards, quickLinks } from "@/components/config/homeData";

export default function HomePage() {
  const { user, loading } = useAuth();

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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {dashboardCards.map((item) => (
            <CardLink key={item.label} item={item} />
          ))}
        </div>

        <QuickAccess links={quickLinks} />
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
          {featureCards.map((f) => (
            <FeatureCard key={f.title} emoji={f.emoji} title={f.title} description={f.description} shadow={f.shadow} />
          ))}
        </div>
      </div>
    </div>
  );
}
