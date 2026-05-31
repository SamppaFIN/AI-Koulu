"use client";

import { useEffect, useState } from "react";

/**
 * AuroraBackground — liikkuva kerrostettu taustagradientti.
 * Käytä Layout.astro-tiedoston body-tagin sisällä.
 * Kevyt: 3 CSS-kerrosta 15s syklillä.
 */
export default function AuroraBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ei renderöidä SSR:ssä — vain asiakaspuolella
  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Kerros 1: pinkki — himmeä taustakoriste */}
      <div
        style={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, oklch(0.65 0.28 350 / 0.06), transparent 70%)",
          top: "-20%",
          left: "-10%",
          animation: "auroraFlow 20s ease-in-out infinite",
          animationDelay: "0s",
        }}
      />
      {/* Kerros 2: violetti — himmeä taustakoriste */}
      <div
        style={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, oklch(0.55 0.24 280 / 0.05), transparent 70%)",
          bottom: "-10%",
          right: "-10%",
          animation: "auroraFlow 25s ease-in-out infinite",
          animationDelay: "5s",
        }}
      />
      {/* Kerros 3: syaani — himmeä taustakoriste */}
      <div
        style={{
          position: "absolute",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, oklch(0.7 0.2 190 / 0.04), transparent 70%)",
          top: "40%",
          left: "50%",
          animation: "auroraFlow 30s ease-in-out infinite",
          animationDelay: "10s",
        }}
      />
    </div>
  );
}
