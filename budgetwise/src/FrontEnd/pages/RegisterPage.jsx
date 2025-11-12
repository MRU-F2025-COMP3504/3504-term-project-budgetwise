"use client";
import { useState } from "react";
;

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    if (form.password !== form.confirm) {
      setMsg("❌ Passwords do not match.");
      return;
    }
 
    setLoading(true);
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name: form.name, email: form.email, password: form.password })
      });
      let data = {};
      try { data = await res.json(); } catch { /* ignore */ }
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setMsg("✅ Registered. Please check your email to verify your account.");
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bw-container max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Create Account</h1>
      <form onSubmit={submit} className="space-y-4 bw-card p-6">
         <input
          type="text"
          required
          placeholder="Name"
          value={form.name}
          onChange={e => update("name", e.target.value)}
          className="bw-input w-full"
        />

        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={e => update("email", e.target.value)}
          className="bw-input w-full"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={form.password}
          onChange={e => update("password", e.target.value)}
          className="bw-input w-full"
        />
        <input
          type="password"
          required
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={e => update("confirm", e.target.value)}
          className="bw-input w-full"
        />
        <button
          disabled={loading}
          className="px-4 py-2 rounded-md bg-[var(--color-accent)] text-black w-full"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
        <p className="text-xs text-[var(--color-text-muted)]">
          Already have an account? <a href="/login" className="underline">Login</a>
        </p>
      </form>
    </div>
  );
}
