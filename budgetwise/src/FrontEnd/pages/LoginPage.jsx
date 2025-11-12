"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../../../lib/helpers/DatabaseConnector";

export default function LoginPage() {
	const router = useRouter();
	const { user, refreshSession } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState("");

	async function submit(e) {
		e.preventDefault();
		setLoading(true);
		setMsg("");
		try {
			// Use the backend API route (which properly sets server-side session)
			const res = await fetch("/api/user/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});
			
			let responseData = {};
			try { responseData = await res.json(); } catch { /* ignore parse errors */ }
			if (!res.ok) throw new Error(responseData.error || "Login failed");
			
			// Set the session on the client-side Supabase instance
			if (responseData.data?.session) {
				await supabase.auth.setSession({
					access_token: responseData.data.session.access_token,
					refresh_token: responseData.data.session.refresh_token
				});
			}
			
			setMsg("✅ Logged in! Checking profile...");
			
			// Refresh the session in AuthContext so navbar updates
			await refreshSession();
			
			// Check if user has a profile
			const profileRes = await fetch("/api/user_profile");
			
			if (profileRes.ok) {
				const profileData = await profileRes.json();
				
				// If profile exists, redirect to dashboard
				if (profileData.profile) {
					setMsg("✅ Profile found! Redirecting to dashboard...");
					setTimeout(() => router.push("/dashboard"), 500);
				} else {
					// No profile, redirect to quiz
					setMsg("✅ Logged in! Please complete your profile...");
					setTimeout(() => router.push("/quiz"), 500);
				}
			} else {
				// Profile API returned error (404 means no profile)
				setMsg("✅ Logged in! Please complete your profile...");
				setTimeout(() => router.push("/quiz"), 500);
			}
		} catch (err) {
			setMsg(`❌ ${err.message}`);
		} finally {
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
					onChange={e => setEmail(e.target.value)}
					className="bw-input w-full"
				/>
				<input
					type="password"
					required
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					className="bw-input w-full"
				/>
				<button
					disabled={loading}
					className="bw-btn bw-btn-primary bw-btn-block"
				>
					{loading ? "Logging in..." : "Login"}
				</button>
				{msg && <p className="text-sm">{msg}</p>}
				<p className="text-xs text-[var(--color-text-muted)]">
					Don’t have an account? <a href="/register" className="underline">Register</a>
				</p>
					</form>
				</div>
			</div>
		</div>
	);
}