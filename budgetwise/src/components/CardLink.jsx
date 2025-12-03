"use client";
import Link from "next/link";

// CardLink Component
// This renders a clickable card with an icon, title, and description.
// It's used on the dashboard to link to different sections of the app.
export default function CardLink({ item }) {
  const { href, label, icon, description, bgColor, shadow, shape, comingSoon } =
    item;
  const commonStyle = {
    boxShadow: `0 0 20px ${shadow || "rgba(0,0,0,0.15)"}`,
    opacity: comingSoon ? 0.6 : 1,
  };
  const IconWrap = (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: shape === "circle" ? "50%" : "6px",
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: comingSoon ? "var(--textcolor3)" : "white",
        fontWeight: "bold",
      }}
    >
      {icon}
    </div>
  );

  const Inner = (
    <div
      className="bw-card p-6 hover:shadow-lg transition-shadow h-full flex flex-col"
      style={commonStyle}
    >
      <div className="flex items-start justify-between mb-3">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--textcolor1)" }}
        >
          {label}
        </h2>
        {IconWrap}
      </div>
      <p
        className="flex-1"
        style={{
          color: "var(--textcolor3)",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
      >
        {description}
      </p>
      {comingSoon && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <span
            className="text-xs"
            style={{ color: "var(--textcolor3)", fontStyle: "italic" }}
          >
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );

  if (comingSoon || !href) return <div className="h-full">{Inner}</div>;
  return (
    <Link href={href} className="block h-full">
      {Inner}
    </Link>
  );
}
