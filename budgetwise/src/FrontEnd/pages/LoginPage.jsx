"use client";
import { useState } from "react";

export default function LoginPage() {
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
			setMsg("✅ Logged in (stub). Redirect coming soon.");
		} catch (err) {
			setMsg(`❌ ${err.message}`);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="bw-container max-w-md">
			<h1 className="text-2xl font-semibold mb-4">Login</h1>
			<form onSubmit={submit} className="space-y-4 bw-card p-6">
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
					className="px-4 py-2 rounded-md bg-[var(--color-accent-2)] text-white w-full"
				>
					{loading ? "Logging in..." : "Login"}
				</button>
				{msg && <p className="text-sm">{msg}</p>}
				<p className="text-xs text-[var(--color-text-muted)]">
					Don’t have an account? <a href="/register" className="underline">Register</a>
				</p>
			</form>
		</div>
	);
}