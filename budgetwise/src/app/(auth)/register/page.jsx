"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Alert from "@/components/Alert";

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  // msg object: { type: 'success'|'error'|'info'|'loading', text }
  const [msg, setMsg] = useState(null);

  // 1. Redirect if Already Logged In
  // If the user is already signed in, they don't need to register.
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // 2. Show Loading State
  // We wait while checking authentication status to avoid flashing the form.
  if (authLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[var(--color-text-muted)] animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);

    // 3. Validate Passwords
    // We make sure the user typed their password correctly twice.
    if (formData.password !== formData.confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      // 4. Create Account
      // We call our auth context to create the user in Supabase.
      const { error } = await register(formData.email, formData.password);

      if (error) throw error;

      // 5. Update Profile Name
      // We try to set the user's display name right away so we can greet them properly.
      try {
        const { createSupabaseBrowserClient } =
          await import("@/lib/helpers/supabaseBrowserClient");
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.updateUser({
          data: { display_name: formData.name },
        });
      } catch (err) {
        console.warn("Failed to update display name", err);
      }

      setMsg({
        type: "success",
        text: "Account created successfully! Setting up your profile...",
      });

      // 6. Redirect to Quiz
      // We wait a moment for everything to sync, then send them to the onboarding quiz.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.push("/quiz");
      router.refresh();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Registration failed" });
      setLoading(false);
    }
  }

  return (
    <div className="bw-container max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Create Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bw-card p-6">
        <input
          type="text"
          required
          placeholder="Name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="bw-input w-full"
        />

        <input
          type="email"
          required
          placeholder="Email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="bw-input w-full"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          className="bw-input w-full"
        />

        <input
          type="password"
          required
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          className="bw-input w-full"
        />

        <button
          disabled={loading}
          className="bw-btn bw-btn-accent bw-btn-block"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {msg && (
          <Alert
            type={msg.type}
            onClose={() => setMsg(null)}
            autoDismiss={5000}
          >
            {msg.text}
          </Alert>
        )}

        <p className="text-xs text-[var(--color-text-muted)]">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
