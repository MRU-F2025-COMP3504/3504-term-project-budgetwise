"use client";

export default function FeatureCard({ emoji, title, description, shadow }) {
  return (
    <div className="bw-card p-8 text-center" style={{ boxShadow: `0 0 30px ${shadow}` }}>
      <div className="mb-4 text-4xl">{emoji}</div>
      <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--textcolor1)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--textcolor3)' }}>{description}</p>
    </div>
  );
}
