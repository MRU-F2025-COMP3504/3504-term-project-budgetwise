"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../../../lib/helpers/DatabaseConnector";
import Alert from "../components/Alert";
import api from "../services/api";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [loading, setLoading] = useState(false);
  // msg object: { type: 'success'|'error'|'info'|'loading', text }
  const [msg, setMsg] = useState(null);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      // Use backend API to establish server-side session
      const response = await api.auth.register(
        formData.name, 
        formData.email, 
        formData.password
      );
      
      // Backend returns { data: { data: { session, user } } }
      // because Supabase returns { data: { session, user } }
      const session = response.data?.data?.session || response.data?.session;
      
      if (!session) {
        // Some Supabase configurations require email confirmation
        setMsg({ type: "info", text: "Please check your email to confirm your account" });
        setLoading(false);
        return;
      }
      
      // Sync client-side session to match server
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
      });
      
      if (sessionError) {
        console.error('Session sync error:', sessionError);
      }
      
      setMsg({ type: "success", text: "Account created successfully! Setting up your profile..." });
      
      // Wait 1.5 seconds to ensure session is fully synced
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Force a page reload to ensure all contexts pick up the new session
      window.location.href = "/quiz";
      
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
          <Alert type={msg.type} onClose={() => setMsg(null)} autoDismiss={5000}>
            {msg.text}
          </Alert>
        )}
        
        <p className="text-xs text-[var(--color-text-muted)]">
          Already have an account? <a href="/login" className="underline">Login</a>
        </p>
      </form>
    </div>
  );
}
