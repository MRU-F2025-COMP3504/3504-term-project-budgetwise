"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Alert from "@/components/Alert";
import api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // 1. Redirect if Already Logged In
  // If we know who the user is, they shouldn't be on the login page.
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // 2. Show Loading State
  // We wait while checking authentication status to avoid flashing the login form.
  if (authLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[var(--color-text-muted)] animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      // 3. Attempt Login
      // We call our auth context to sign the user in with Supabase.
      const { error } = await login(email, password);
      if (error) throw error;

      // 4. Determine Where to Go Next
      // If the user has a profile set up, they go to the dashboard.
      // If not (e.g., first time), we send them to the quiz to get started.
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
        // If checking the profile fails, we default to the quiz just to be safe.
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
    <div className="bw-container">
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>
          <form onSubmit={submit} className="bw-card p-5 space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bw-input w-full"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bw-input w-full"
            />
            <button
              disabled={loading}
              className="bw-btn bw-btn-primary bw-btn-block"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {msg && (
              <div className="mt-2">
                <Alert type={msg.type} onClose={() => setMsg(null)}>
                  {msg.text}
                </Alert>
              </div>
            )}
            <p className="text-xs text-[var(--color-text-muted)]">
              Don't have an account?{" "}
              <a href="/register" className="underline">
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
