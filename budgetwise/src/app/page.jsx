"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 1. Check Loading State
  // We wait until we know if the user is logged in or not.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div style={{ color: "var(--textcolor3)" }}>Loading...</div>
      </div>
    );
  }

  // 2. Redirect if Signed In
  // If the user is already logged in, we send them straight to the dashboard.
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

<<<<<<< HEAD
  // Not signed in - landing page
=======
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[var(--color-text-muted)] animate-pulse">
          Redirecting to Dashboard...
        </div>
      </div>
    );
  }

  // 3. Render Landing Page
  // If no user is logged in, we show the welcome screen with Sign In/Sign Up buttons.
>>>>>>> 1192b86 (refactor: Consolidate Budgets/Categories and cleanup codebase)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[var(--background)]">
      {/* Main Content */}
      <div className="z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 text-white">
          BudgetWise
        </h1>

        <p className="text-xl md:text-2xl text-[var(--color-text-muted)] mb-12 font-light tracking-wide">
          Financial clarity, simplified.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-8 py-3 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/50 transition-all duration-300 font-medium text-sm md:text-base"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 transition-all duration-300 font-medium text-sm md:text-base"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
