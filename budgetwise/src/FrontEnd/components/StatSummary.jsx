"use client";

export default function StatSummary({ stats = [] }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map(s => (
        <div key={s.label} className="bw-card p-4">
          <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
          <p className="text-xl font-semibold mt-1">{s.value}</p>
          {s.sub && <p className="text-[10px] mt-1 text-[var(--color-text-muted)]">{s.sub}</p>}
        </div>
      ))}
      {stats.length === 0 && <p className="text-[var(--color-text-muted)] text-sm">No stats</p>}
    </div>
  );
}
