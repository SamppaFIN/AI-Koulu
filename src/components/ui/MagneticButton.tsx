"use client";

import { useRef, useState, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  /** Magneettikentän vahvuus pikseleinä (0 = pois) */
  strength?: number;
}

/**
 * MagneticButton — hiirtä seuraava nappi Aurora MagneticButtonsTechnique -pohjalta.
 * Nappi "vetää" hiirtä puoleensa kevyesti, luoden magneettisen tunteen.
 */
export default function MagneticButton({
  children,
  onClick,
  className = "",
  disabled = false,
  strength = 8,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled || strength === 0) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const maxDist = Math.max(rect.width, rect.height);

    // Lähellä hiirtä = vahvempi veto, kaukana = heikompi
    const factor = Math.max(0, 1 - Math.sqrt(distX ** 2 + distY ** 2) / maxDist);
    setPosition({
      x: distX * factor * (strength / 20),
      y: distY * factor * (strength / 20),
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        position: "relative",
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.15s ease-out",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        border: "none",
        borderRadius: "10px",
        padding: "0.75rem 1.5rem",
        fontWeight: 600,
        fontSize: "0.95rem",
        background: "var(--aurora-gradient-1)",
        color: "white",
        fontFamily: "inherit",
        boxShadow: "0 4px 15px oklch(0.55 0.24 280 / 0.3)",
      }}
    >
      {children}
    </button>
  );
}
