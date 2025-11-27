"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Alert from "@/components/Alert";
import api from "@/services/api";

export default function LoginPage() {
	const router = useRouter();
	const { user, login } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
		const [loading, setLoading] = useState(false);
		// msg: { type: 'info'|'success'|'error'|'loading', text: string }
		const [msg, setMsg] = useState(null);

	async function submit(e) {
		e.preventDefault();
		setLoading(true);
		setMsg(null);
		try {
			// Use AuthContext login which handles Supabase auth and cookies
			const { error } = await login(email, password);
			
			if (error) throw error;
			
			// Check if user has a profile to determine redirect destination
			let redirectTo = "/dashboard";
			try {
				const profileResponse = await api.profile.get();
				const hasProfile = profileResponse?.data?.profile && 
				                  Object.keys(profileResponse.data.profile).length > 0;
				
				if (!hasProfile) {
					redirectTo = "/quiz";
					setMsg({ type: "success", text: "Logged in successfully! Let's set up your profile..." });
				} else {
					setMsg({ type: "success", text: "Logged in successfully! Redirecting..." });
				}
			} catch (profileErr) {
				// If profile check fails, assume no profile and redirect to quiz
				console.log('No profile found, redirecting to quiz');
				redirectTo = "/quiz";
				setMsg({ type: "success", text: "Logged in successfully! Let's set up your profile..." });
			}
			
			// Wait 1 second so user can see the success message
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			router.push(redirectTo);
			router.refresh(); // Refresh server components
			
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
								{msg && (
									<div className="mt-2">
										<Alert type={msg.type} onClose={() => setMsg(null)}>
											{msg.text}
										</Alert>
									</div>
								)}
				<p className="text-xs text-[var(--color-text-muted)]">
					Don't have an account? <a href="/register" className="underline">Register</a>
				</p>
					</form>
				</div>
			</div>
		</div>
	);
}
