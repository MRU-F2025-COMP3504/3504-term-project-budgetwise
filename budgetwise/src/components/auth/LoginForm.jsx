"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Alert from "@/components/Alert";
import api from "@/services/api";

export default function LoginForm({ onSwitch }) {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await login(email, password);
      if (error) throw error;

      let redirectTo = "/dashboard";
      try {
        const profileResponse = await api.profile.get();
        const hasProfile =
          profileResponse?.data?.profile &&
          Object.keys(profileResponse.data.profile).length > 0;

        if (!hasProfile) {
          redirectTo = "/quiz";
        }
      } catch (profileErr) {
        redirectTo = "/quiz";
      }

      setMsg({ type: "success", text: "Logged in successfully!" });
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Login failed" });
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
      <h1 className="text-3xl font-bold mb-2 text-center text-white">
        Sign In
      </h1>
      <p className="text-center text-[var(--color-text-muted)] mb-8 text-sm">
        Enter your email below to sign in to your account
      </p>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bw-input w-full bg-[var(--surface-raised)] border-white/10 focus:border-purple-500 focus:ring-purple-500/20"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bw-input w-full bg-[var(--surface-raised)] border-white/10 focus:border-purple-500 focus:ring-purple-500/20"
        />

        <button
          disabled={loading}
          className="w-full py-2.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {msg && (
          <div className="mt-2">
            <Alert type={msg.type} onClose={() => setMsg(null)}>
              {msg.text}
            </Alert>
          </div>
        )}

        <p className="text-sm text-center text-[var(--color-text-muted)] mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-white hover:underline font-medium"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}
