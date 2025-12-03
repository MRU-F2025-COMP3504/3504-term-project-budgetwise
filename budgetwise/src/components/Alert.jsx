"use client";
import { useEffect } from "react";

export default function Alert({
  type = "info",
  children,
  onClose,
  autoDismiss = 4500,
}) {
  // 1. Auto-Dismiss
  // If an autoDismiss time is provided, we set a timer to close the alert automatically.
  useEffect(() => {
    if (!onClose || !autoDismiss) return;
    const t = setTimeout(() => onClose(), autoDismiss);
    return () => clearTimeout(t);
  }, [autoDismiss, onClose]);

  const map = {
    success: { color: "var(--status-success)", icon: "✅" },
    error: { color: "var(--status-danger)", icon: "❌" },
    info: { color: "var(--buttoncolor1)", icon: "ℹ️" },
    loading: { color: "var(--buttoncolor1)", icon: "⏳" },
  };

  const meta = map[type] || map.info;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="bw-card p-3 flex items-start justify-between"
      style={{
        gap: "0.75rem",
        alignItems: "flex-start",
        borderLeft: `4px solid ${meta.color}`,
        background: "var(--color-surface-2)",
      }}
    >
      <div
        style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: meta.color,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {meta.icon}
        </div>
        <div
          style={{
            color: "var(--color-text)",
            fontSize: "0.95rem",
            lineHeight: 1.3,
          }}
        >
          {children}
        </div>
      </div>

      <div style={{ marginLeft: 12 }}>
        {onClose && (
          <button
            onClick={() => onClose()}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--secondarytext2)",
              fontSize: 18,
              cursor: "pointer",
              padding: 6,
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
