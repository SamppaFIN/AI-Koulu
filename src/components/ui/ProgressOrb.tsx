"use client";

import { useEffect, useState } from "react";

interface ProgressOrbProps {
  /** 0-100 */
  progress: number;
  size?: number;
  label?: string;
}

/**
 * ProgressOrb — pyöreä edistymisindikaattori ConsciousProgressBar-pohjalta.
 * Näyttää edistymisen animoituna ympyränä, glow-efektillä.
 */
export default function ProgressOrb({
  progress,
  size = 100,
  label,
}: ProgressOrbProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const clamped = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(clamped), 100);
    return () => clearTimeout(timer);
  }, [clamped]);

  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedProgress / 100) * circumference;

  // Väri: brand → success-gradientin mukaan
  const hue = animatedProgress < 33 ? 280 : animatedProgress < 66 ? 240 : 150;
  const color = `oklch(0.6 0.22 ${hue})`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
      role="progressbar"
      aria-valuenow={animatedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 8px ${color}66)` }}
      >
        {/* Taustaympyrä */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-bg-code)"
          strokeWidth={6}
        />
        {/* Edistymiskaari */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        {/* Teksti keskellä */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--color-text)"
          fontSize={size * 0.22}
          fontWeight={700}
          style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
        >
          {Math.round(animatedProgress)}%
        </text>
      </svg>
      {label && (
        <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  );
}
