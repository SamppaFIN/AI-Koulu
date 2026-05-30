import type { ReactNode } from "react";

interface WhyItMattersProps {
  children: ReactNode;
}

export default function WhyItMatters({ children }: WhyItMattersProps) {
  return (
    <div
      style={{
        background: "color-mix(in oklab, var(--color-brand) 12%, var(--color-bg-card))",
        border: "1px solid color-mix(in oklab, var(--color-brand) 25%, var(--color-border))",
        borderRadius: "12px",
        padding: "1.25rem 1.5rem",
        marginBlock: "1.5rem",
      }}
    >
      <p
        style={{
          fontWeight: 800,
          fontSize: "0.9rem",
          color: "var(--color-brand)",
          margin: "0 0 0.5rem 0",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>🎯</span>
        Miksi tällä on väliä?
      </p>
      <div style={{ color: "var(--color-text)", lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}
