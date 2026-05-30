"use client";

import type { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  /** Glow-väri (OKLCH tai mikä tahansa CSS-väri) */
  glowColor?: string;
}

/**
 * GlowCard — reunaa pitkin kulkeva hohtoefekti (CardGlow-animaatio).
 * Lasimainen kortti, jonka reunalla on liikkuva gradient-hohto.
 */
export default function GlowCard({
  children,
  className = "",
  glowColor,
}: GlowCardProps) {
  return (
    <div
      className={`glow-border living-card ${className}`}
      style={{
        position: "relative",
        background: "var(--glass-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "12px",
        padding: "1.5rem",
        overflow: "hidden",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: glowColor
          ? `0 0 20px ${glowColor}33`
          : "0 4px 20px oklch(0 0 0 / 0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "100%",
          background: glowColor
            ? `linear-gradient(90deg, transparent, ${glowColor}22, transparent)`
            : "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.1), transparent)",
          animation: "cardGlow 3s linear infinite",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}
