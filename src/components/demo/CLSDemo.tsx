"use client";

import { useState, useRef } from "react";

/**
 * CLS-virheen visualisointi: simuloi layout shiftiä,
 * jossa kuvan latautuminen myöhässä työntää sisältöä.
 */

export default function CLSDemo() {
  const [showImage, setShowImage] = useState(false);
  const [shiftCount, setShiftCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerShift = () => {
    setIsAnimating(true);
    setShowImage(true);
    setShiftCount((prev) => prev + 1);

    // Laske CLS-pisteet (simuloitu)
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  const reset = () => {
    setShowImage(false);
    setShiftCount(0);
  };

  return (
    <div
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBlock: "1.5rem",
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
        📐 CLS-virheen visualisointi
      </p>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        Klikkaa "Lisää kuva" nähdäksesi layout-shiftin vaikutuksen
      </p>

      <div
        ref={containerRef}
        style={{
          background: "var(--color-bg)",
          borderRadius: "8px",
          border: `2px solid ${isAnimating ? "var(--color-error)" : "var(--color-border)"}`,
          padding: "1rem",
          transition: "border-color 0.3s",
          position: "relative",
        }}
      >
        {/* Simuloitu sisältö */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "var(--color-bg-code)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ height: "12px", background: "var(--color-bg-code)", borderRadius: "4px", width: "60%", marginBottom: "0.5rem" }} />
            <div style={{ height: "8px", background: "var(--color-bg-code)", borderRadius: "4px", width: "80%" }} />
          </div>
        </div>

        <div style={{ height: "8px", background: "var(--color-bg-code)", borderRadius: "4px", marginBottom: "0.5rem", width: "40%" }} />
        <div style={{ height: "8px", background: "var(--color-bg-code)", borderRadius: "4px", marginBottom: "0.5rem", width: "90%" }} />
        <div style={{ height: "8px", background: "var(--color-bg-code)", borderRadius: "4px", marginBottom: "0.75rem", width: "70%" }} />

        {/* Tämä on se elementti, joka aiheuttaa shiftin */}
        <div
          style={{
            overflow: "hidden",
            transition: "max-height 0.5s ease, opacity 0.3s ease",
            maxHeight: showImage ? "150px" : "0",
            opacity: showImage ? 1 : 0,
          }}
        >
          <div
            style={{
              background: isAnimating ? "var(--color-error)" : "var(--color-bg-code)",
              borderRadius: "8px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isAnimating ? "white" : "var(--color-text-muted)",
              fontWeight: 600,
              transition: "background 0.3s",
            }}
          >
            {isAnimating ? (
              <span>⚠️ Latautui myöhässä! Työnsi sisältöä alas</span>
            ) : (
              <span>🖼️ Kuva ladattu</span>
            )}
          </div>
        </div>

        <div style={{ height: "8px", background: "var(--color-bg-code)", borderRadius: "4px", marginTop: "0.75rem", width: "50%" }} />
        <div style={{ height: "8px", background: "var(--color-bg-code)", borderRadius: "4px", marginTop: "0.5rem", width: "30%" }} />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", alignItems: "center" }}>
        <button
          onClick={triggerShift}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            background: "var(--color-brand)",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {showImage ? "Lisää toinen kuva" : "Lisää kuva"}
        </button>
        <button
          onClick={reset}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg)",
            color: "var(--color-text-secondary)",
            cursor: "pointer",
          }}
        >
          Nollaa
        </button>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <p style={{ margin: 0, fontWeight: 700, color: isAnimating ? "var(--color-error)" : "var(--color-text-muted)" }}>
            CLS-pisteet: {(shiftCount * 0.25).toFixed(2)}
          </p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
            Tavoite: &lt; 0.1
          </p>
        </div>
      </div>
    </div>
  );
}
