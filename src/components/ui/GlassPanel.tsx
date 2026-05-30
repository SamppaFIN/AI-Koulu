"use client";

import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  /** Lasin sameus (0-1) */
  blur?: number;
}

/**
 * GlassPanel — lasimainen paneeli backdrop-filterillä.
 * Käytä tätä Callout-tyyppisten elementtien korvaamiseen.
 */
export default function GlassPanel({
  children,
  className = "",
  blur = 12,
}: GlassPanelProps) {
  return (
    <div
      className={className}
      style={{
        background: "var(--glass-bg)",
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: "1px solid var(--glass-border)",
        borderRadius: "12px",
        padding: "1.25rem 1.5rem",
        boxShadow: "var(--glass-shadow)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
