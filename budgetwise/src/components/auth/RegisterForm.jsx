"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Alert from "@/components/Alert";

export default function RegisterForm({ onSwitch }) {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);

    if (formData.password !== formData.confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const { error } = await register(formData.email, formData.password);
      if (error) throw error;

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
        text: "Account created! Redirecting...",
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/quiz");
      router.refresh();
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Registration failed" });
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
      <h1 className="text-3xl font-bold mb-2 text-center text-white">
        Create Account
      </h1>
      <p className="text-center text-[var(--color-text-muted)] mb-8 text-sm">
        Enter your details below to create your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          required
          placeholder="Name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="bw-input w-full bg-[var(--surface-raised)] border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20"
        />
        <input
          type="email"
          required
          placeholder="name@example.com"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="bw-input w-full bg-[var(--surface-raised)] border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          className="bw-input w-full bg-[var(--surface-raised)] border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20"
        />
        <input
          type="password"
          required
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          className="bw-input w-full bg-[var(--surface-raised)] border-white/10 focus:border-emerald-500 focus:ring-emerald-500/20"
        />

        <button
          disabled={loading}
          className="w-full py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {msg && (
          <div className="mt-2">
            <Alert type={msg.type} onClose={() => setMsg(null)}>
              {msg.text}
            </Alert>
          </div>
        )}

        <p className="text-sm text-center text-[var(--color-text-muted)] mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="text-white hover:underline font-medium"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
}
