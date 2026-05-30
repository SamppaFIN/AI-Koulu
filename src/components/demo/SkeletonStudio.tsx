"use client";

import { useState, useEffect } from "react";

/**
 * Skeleton loader -studio: vertaile skeleton-näyttöjä ja spinnereita.
 * Havainnollistaa progressiivista latausta vs. perinteistä spinneriä.
 */

type Mode = "skeleton" | "spinner";

function SimulatedCard({ mode, delay }: { mode: Mode; delay: number }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (loading && mode === "skeleton") {
    return (
      <div
        style={{
          background: "var(--color-bg)",
          borderRadius: "10px",
          border: "1px solid var(--color-border)",
          padding: "1rem",
        }}
        aria-label="Ladataan..."
      >
        <div
          style={{
            width: "100%",
            height: "80px",
            background: "var(--color-bg-code)",
            borderRadius: "6px",
            marginBottom: "0.75rem",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: "12px",
            background: "var(--color-bg-code)",
            borderRadius: "4px",
            width: "70%",
            marginBottom: "0.5rem",
            animation: "shimmer 1.5s ease-in-out infinite",
            animationDelay: "0.2s",
          }}
        />
        <div
          style={{
            height: "8px",
            background: "var(--color-bg-code)",
            borderRadius: "4px",
            width: "90%",
            marginBottom: "0.5rem",
            animation: "shimmer 1.5s ease-in-out infinite",
            animationDelay: "0.3s",
          }}
        />
        <div
          style={{
            height: "8px",
            background: "var(--color-bg-code)",
            borderRadius: "4px",
            width: "50%",
            animation: "shimmer 1.5s ease-in-out infinite",
            animationDelay: "0.4s",
          }}
        />
      </div>
    );
  }

  if (loading && mode === "spinner") {
    return (
      <div
        style={{
          background: "var(--color-bg)",
          borderRadius: "10px",
          border: "1px solid var(--color-border)",
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "160px",
        }}
        aria-label="Ladataan..."
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            border: "3px solid var(--color-bg-code)",
            borderTopColor: "var(--color-brand)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--color-bg)",
        borderRadius: "10px",
        border: "1px solid var(--color-border)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "80px",
          background: "var(--color-bg-code)",
          borderRadius: "6px",
          marginBottom: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
        }}
      >
        📄
      </div>
      <p style={{ fontWeight: 600, margin: "0 0 0.25rem 0" }}>Artikkeli ladattu</p>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0 }}>
        Sisältö on nyt valmis luettavaksi.
      </p>
    </div>
  );
}

export default function SkeletonStudio() {
  const [mode, setMode] = useState<Mode>("skeleton");
  const [count, setCount] = useState(3);
  const [delay, setDelay] = useState(2000);
  const [key, setKey] = useState(0);

  const reload = () => setKey((k) => k + 1);

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
        🦴 Skeleton loader -studio
      </p>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        Vertaa skeleton-näyttöjä ja spinnereita eri määrillä ja nopeuksilla
      </p>

      {/* Säätimet */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem", alignItems: "flex-end" }}>
        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.25rem" }}>Tila</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setMode("skeleton")}
              style={{
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                border: mode === "skeleton" ? "2px solid var(--color-brand)" : "1px solid var(--color-border)",
                background: mode === "skeleton" ? "color-mix(in oklab, var(--color-brand) 15%, var(--color-bg))" : "var(--color-bg)",
                cursor: "pointer",
                fontWeight: mode === "skeleton" ? 600 : 400,
                color: "var(--color-text)",
              }}
            >
              Skeleton
            </button>
            <button
              onClick={() => setMode("spinner")}
              style={{
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                border: mode === "spinner" ? "2px solid var(--color-brand)" : "1px solid var(--color-border)",
                background: mode === "spinner" ? "color-mix(in oklab, var(--color-brand) 15%, var(--color-bg))" : "var(--color-bg)",
                cursor: "pointer",
                fontWeight: mode === "spinner" ? 600 : 400,
                color: "var(--color-text)",
              }}
            >
              Spinner
            </button>
          </div>
        </div>

        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.25rem" }}>Kortteja: {count}</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[1, 3, 6].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                style={{
                  padding: "0.4rem 0.75rem",
                  borderRadius: "6px",
                  border: count === n ? "2px solid var(--color-brand)" : "1px solid var(--color-border)",
                  background: count === n ? "color-mix(in oklab, var(--color-brand) 15%, var(--color-bg))" : "var(--color-bg)",
                  cursor: "pointer",
                  color: "var(--color-text)",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.25rem" }}>
            Viive: {delay}ms
          </p>
          <input
            type="range"
            min={500}
            max={4000}
            step={500}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            aria-label="Latausviive millisekunteina"
            style={{ width: "120px" }}
          />
        </div>

        <button
          onClick={reload}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            background: "var(--color-brand)",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🔄 Lataa uudelleen
        </button>
      </div>

      {/* Kortit */}
      <div
        key={key}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(count, 3)}, 1fr)`,
          gap: "0.75rem",
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <SimulatedCard key={i} mode={mode} delay={delay} />
        ))}
      </div>

      <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "1rem" }}>
        {mode === "skeleton"
          ? "💡 Skeleton: näyttää tulevan sisällön rakenteen — käyttäjä näkee heti mitä on tulossa."
          : "💡 Spinner: kertoo että jotain tapahtuu — mutta käyttäjä ei tiedä mitä tai milloin."}
      </p>

      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
