import type { ReactNode } from "react";

interface AnalogyBoxProps {
  children: ReactNode;
  /** Optional title override */
  title?: string;
}

export default function AnalogyBox({ children, title = "💡 Reaalimaailman analogia" }: AnalogyBoxProps) {
  return (
    <div
      style={{
        background: "color-mix(in oklab, var(--color-accent) 10%, var(--color-bg-card))",
        border: "1px solid color-mix(in oklab, var(--color-accent) 30%, var(--color-border))",
        borderLeft: "4px solid var(--color-accent)",
        borderRadius: "12px",
        padding: "1.25rem 1.5rem",
        marginBlock: "1.5rem",
      }}
    >
      <p
        style={{
          fontWeight: 700,
          fontSize: "0.85rem",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--color-accent)",
          margin: "0 0 0.5rem 0",
        }}
      >
        {title}
      </p>
      <div style={{ color: "var(--color-text)", lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}
