"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState("");

	async function submit(e) {
		e.preventDefault();
		setLoading(true);
		setMsg("");
		try {
			const res = await fetch("/api/user/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});
			
			let data = {};
			try { data = await res.json(); } catch { /* ignore parse errors */ }
			if (!res.ok) throw new Error(data.error || "Login failed");
			
			// Check if user has a profile
			const profileRes = await fetch("/api/user_profile");
			
			if (profileRes.ok) {
				const profileData = await profileRes.json();
				
				// If profile exists, redirect to dashboard
				if (profileData.profile) {
					setMsg("✅ Logged in! Redirecting to dashboard...");
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