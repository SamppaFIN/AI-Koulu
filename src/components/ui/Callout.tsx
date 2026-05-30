import type { ReactNode } from "react";

type Variant = "info" | "warning" | "tip" | "error";

interface CalloutProps {
  type?: Variant;
  children: ReactNode;
}

const variantStyles: Record<Variant, { icon: string; bg: string; border: string }> = {
  info: {
    icon: "ℹ️",
    bg: "oklch(0.6 0.18 240 / 0.1)",
    border: "oklch(0.6 0.18 240 / 0.3)",
  },
  warning: {
    icon: "⚠️",
    bg: "oklch(0.7 0.2 85 / 0.1)",
    border: "oklch(0.7 0.2 85 / 0.3)",
  },
  tip: {
    icon: "💡",
    bg: "oklch(0.6 0.2 150 / 0.1)",
    border: "oklch(0.6 0.2 150 / 0.3)",
  },
  error: {
    icon: "❌",
    bg: "oklch(0.6 0.22 25 / 0.1)",
    border: "oklch(0.6 0.22 25 / 0.3)",
  },
};

export default function Callout({ type = "info", children }: CalloutProps) {
  const styles = variantStyles[type];

  return (
    <div
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        marginBlock: "1.5rem",
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
      }}
      role="alert"
    >
      <span style={{ fontSize: "1.3rem", flexShrink: 0, marginTop: "0.1rem" }}>
        {styles.icon}
      </span>
      <div style={{ color: "var(--color-text)", lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}
