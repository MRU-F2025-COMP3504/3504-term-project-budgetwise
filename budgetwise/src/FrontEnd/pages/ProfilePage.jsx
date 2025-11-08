"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/user_profile");
        const data = await res.json().catch(()=>({}));
        if (!ignore) setProfiles(data.UserProfile || []);
      } catch {
        if (!ignore) setProfiles([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  return (
    <div className="bw-container">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      {loading && <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>}
      {profiles.length === 0 && !loading && <p className="text-[var(--color-text-muted)]">No profile records.</p>}
      <div className="space-y-4">
        {profiles.map(p => (
          <div key={p.id} className="bw-card p-4 text-xs">
            <pre>{JSON.stringify(p, null, 2)}</pre>
          </div>
        ))}
      </div>
      <p className="text-xs mt-6 text-[var(--color-text-muted)]">
        Future: editable preferences, goals, risk profile, quiz answers normalization.
      </p>
    </div>
  );
}
