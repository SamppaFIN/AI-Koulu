"use client";

import type { ReactNode } from "react";

interface LivingCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: "lift" | "glow" | "both";
}

/**
 * LivingCard — hengittävä kortti BreathingCard-pohjalta.
 * Yhdistää lasimaisen pinnan, glow-efektin ja hover-animaation.
 */
export default function LivingCard({
  children,
  className = "",
  glow = false,
  hover = "lift",
}: LivingCardProps) {
  return (
    <div
      className={`glass-card living-card ${glow ? "glow-border" : ""} ${className}`}
      style={{
        padding: "1.5rem",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
        animation: glow ? "auroraPulse 3s ease-in-out infinite" : "none",
      }}
    >
      {children}
    </div>
  );
}
