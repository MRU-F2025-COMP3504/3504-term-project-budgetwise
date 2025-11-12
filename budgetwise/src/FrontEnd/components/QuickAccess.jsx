"use client";
import Link from "next/link";

export default function QuickAccess({ links = [] }) {
  const variantClass = (v) => {
    switch (v) {
      case 'primary': return 'bw-btn bw-btn-primary';
      case 'accent': return 'bw-btn bw-btn-accent';
      case 'neutral':
      default: return 'bw-btn bw-btn-neutral';
    }
  };

  return (
    <div className="bw-card p-6" style={{ background: 'var(--surface-raised)' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--textcolor2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Quick Access
      </h3>
      <div className="flex gap-3 flex-wrap">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={variantClass(l.variant)}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
