"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [view, setView] = useState("landing"); // 'landing' | 'login' | 'register'

  // 1. Check Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-[var(--color-text-muted)] animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // 2. Redirect if Signed In
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-[var(--color-text-muted)] animate-pulse">
          Redirecting to Dashboard...
        </div>
      </div>
    );
  }

  // 3. Render Animated Landing Page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[var(--background)]">
      {/* Logo Container */}
      <div
        className={`flex flex-col items-center transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform ${
          view === "landing" ? "translate-y-0" : "-translate-y-[140px]"
        }`}
      >
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 text-white transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
          BudgetWise
        </h1>

        {/* Slogan - Stays visible, moves up with logo */}
        <p className="text-xl md:text-2xl text-[var(--color-text-muted)] font-light tracking-wide transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
          Financial clarity, simplified.
        </p>

        {/* Initial Buttons - Soft Vanish */}
        <div
          className={`flex gap-4 mt-12 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            view === "landing"
              ? "opacity-100 translate-y-0 delay-300"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <button
            onClick={() => setView("login")}
            className="px-8 py-3 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/50 transition-all duration-300 font-medium text-sm md:text-base backdrop-blur-sm"
          >
            Sign In
          </button>
          <button
            onClick={() => setView("register")}
            className="px-8 py-3 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 transition-all duration-300 font-medium text-sm md:text-base backdrop-blur-sm"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Auth Forms Container - Fades in when entering auth mode */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] delay-100 will-change-transform ${
          view !== "landing"
            ? "opacity-100 translate-y-[40px] z-10"
            : "opacity-0 translate-y-[40px] pointer-events-none"
        }`}
      >
        {view === "login" && (
          <div className="relative">
            <button
              onClick={() => setView("landing")}
              className="absolute -top-16 left-0 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors flex items-center gap-1"
            >
              ← Back
            </button>
            <LoginForm onSwitch={() => setView("register")} />
          </div>
        )}
        {view === "register" && (
          <div className="relative">
            <button
              onClick={() => setView("landing")}
              className="absolute -top-16 left-0 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors flex items-center gap-1"
            >
              ← Back
            </button>
            <RegisterForm onSwitch={() => setView("login")} />
          </div>
        )}
      </div>
    </div>
  );
}
