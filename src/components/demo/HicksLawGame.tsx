"use client";

import { useState, useRef, useCallback } from "react";

/**
 * Hickin laki -peli: mittaa reaktioaikaa eri valintamäärillä.
 * Havainnollistaa kuinka valinnan aika kasvaa logaritmisesti vaihtoehtojen määrän myötä.
 */

const OPTION_COUNTS = [2, 4, 8, 16];

interface RoundResult {
  options: number;
  time: number;
}

export default function HicksLawGame() {
  const [optionCount, setOptionCount] = useState(4);
  const [target, setTarget] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [phase, setPhase] = useState<"waiting" | "ready" | "result">("waiting");
  const [startTime, setStartTime] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const startRound = useCallback(() => {
    const count = OPTION_COUNTS[Math.floor(Math.random() * OPTION_COUNTS.length)];
    setOptionCount(count);
    setTarget(Math.floor(Math.random() * count));
    setPhase("waiting");

    // Random viive 1-3s ennen kuin peli alkaa
    const delay = 1000 + Math.random() * 2000;
    timeoutRef.current = setTimeout(() => {
      setPhase("ready");
      setStartTime(Date.now());
    }, delay);
  }, []);

  const handleClick = (index: number) => {
    if (phase !== "ready") return;
    const time = Date.now() - startTime;
    const isCorrect = index === target;

    setResults((prev) => [...prev, { options: optionCount, time }]);
    setPhase("result");

    setTimeout(() => {
      setPhase("waiting");
      startRound();
    }, 1500);
  };

  // Laske keskiarvot
  const averages = OPTION_COUNTS.map((count) => {
    const filtered = results.filter((r) => r.options === count);
    if (filtered.length === 0) return null;
    return {
      options: count,
      avgTime: Math.round(filtered.reduce((s, r) => s + r.time, 0) / filtered.length),
      count: filtered.length,
    };
  }).filter(Boolean);

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
        🎯 Hickin laki -peli
      </p>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        Klikkaa oikeaa kohdetta mahdollisimman nopeasti
      </p>

      {phase === "waiting" && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
            {results.length === 0 ? "Paina aloittaaksesi" : "Odota seuraavaa kierrosta..."}
          </p>
          {results.length === 0 && (
            <button
              onClick={startRound}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 2rem",
                borderRadius: "8px",
                border: "none",
                background: "var(--color-brand)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Aloita peli
            </button>
          )}
        </div>
      )}

      {phase === "ready" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(4, optionCount)}, 1fr)`,
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {Array.from({ length: optionCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              style={{
                padding: "1.5rem 0.5rem",
                borderRadius: "10px",
                border: i === target ? "2px solid var(--color-brand)" : "1px solid var(--color-border)",
                background: i === target ? "color-mix(in oklab, var(--color-brand) 15%, var(--color-bg))" : "var(--color-bg)",
                cursor: "pointer",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--color-text)",
                transition: "transform 0.1s",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {phase === "result" && (
        <div style={{ textAlign: "center", padding: "1rem", color: "var(--color-brand)", fontWeight: 600 }}>
          Valmistaudu seuraavaan...
        </div>
      )}

      {/* Tulokset */}
      {averages.length > 0 && (
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            paddingTop: "1rem",
            marginTop: "0.5rem",
          }}
        >
          <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            📊 Reaktioajat (keskiarvo)
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {averages.map((a) =>
              a ? (
                <div
                  key={a.options}
                  style={{
                    flex: 1,
                    minWidth: "80px",
                    background: "var(--color-bg)",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    textAlign: "center",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", margin: "0 0 0.25rem 0" }}>
                    {a.options} vaihtoehtoa
                  </p>
                  <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "var(--color-brand)" }}>
                    {a.avgTime}ms
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", margin: "0.15rem 0 0 0" }}>
                    ({a.count} mittausta)
                  </p>
                </div>
              ) : null
            )}
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Hickin laki: T = a + b × log₂(n). Enemmän vaihtoehtoja → hitaampi reaktio.
          </p>
          <button
            onClick={() => { setResults([]); setPhase("waiting"); }}
            style={{
              marginTop: "0.5rem",
              padding: "0.4rem 1rem",
              borderRadius: "6px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              cursor: "pointer",
              fontSize: "0.85rem",
              color: "var(--color-text-secondary)",
            }}
          >
            Tyhjennä tulokset
          </button>
        </div>
      )}
    </div>
  );
}
