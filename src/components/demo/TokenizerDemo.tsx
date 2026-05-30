"use client";

import { useState } from "react";

/**
 * Tokenisoija-demo: havainnollistaa BPE-tyyppisen pilkkomisen.
 * Simuloi miten tekstistä tehdään tokeneita.
 */

interface Token {
  text: string;
  id: number;
}

// Yksinkertaistettu BPE-simulaatio — oikea tokenisaattori käyttää enemmän sääntöjä
function simulateTokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let id = 0;

  // Yksinkertainen regex-pohjainen pilkkominen sanoihin ja välimerkkeihin
  const parts = text.match(/\S+|\s+/g) || [];

  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      // Välilyönnit omina tokeneinaan
      tokens.push({ text: part, id: id++ });
    } else if (part.length <= 3) {
      // Lyhyet sanat yhtenä tokenina
      tokens.push({ text: part, id: id++ });
    } else {
      // Pidemmät sanat jaetaan alaosiin
      const len = Math.min(part.length, Math.floor(part.length / 2) + 1);
      const mid = Math.ceil(part.length / 2);
      tokens.push({ text: part.slice(0, mid), id: id++ });
      tokens.push({ text: part.slice(mid), id: id++ });
    }
  }

  return tokens;
}

const COLORS = [
  "oklch(0.6 0.2 150 / 0.2)",
  "oklch(0.6 0.18 240 / 0.2)",
  "oklch(0.6 0.22 25 / 0.2)",
  "oklch(0.65 0.2 85 / 0.2)",
  "oklch(0.55 0.24 280 / 0.2)",
  "oklch(0.6 0.2 180 / 0.2)",
  "oklch(0.65 0.18 30 / 0.2)",
  "oklch(0.55 0.2 300 / 0.2)",
];

export default function TokenizerDemo() {
  const [input, setInput] = useState("Moikka maailma!");
  const tokens = simulateTokenize(input);

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
      <p style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
        🔤 Tokenisaattori
      </p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="Syötä tekstiä tokenisoitavaksi"
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid var(--color-border)",
          background: "var(--color-bg)",
          color: "var(--color-text)",
          fontSize: "1rem",
          marginBottom: "1rem",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          minHeight: "2.5rem",
          padding: "0.75rem",
          borderRadius: "8px",
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
        }}
        role="region"
        aria-label="Tokenit"
      >
        {tokens.map((token, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              background: COLORS[i % COLORS.length],
              borderRadius: "6px",
              padding: "0.2rem 0.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
            }}
            title={`Token ID: ${token.id}`}
          >
            <span>{token.text === " " ? "\u00B7" : token.text}</span>
            <span
              style={{
                fontSize: "0.7rem",
                opacity: 0.6,
                fontWeight: 600,
              }}
            >
              #{token.id}
            </span>
          </span>
        ))}
      </div>

      <p
        style={{
          marginTop: "0.75rem",
          fontSize: "0.85rem",
          color: "var(--color-text-muted)",
        }}
      >
        {tokens.length} token{tokens.length !== 1 ? "ia" : "i"}
        {" — "}
        kukin pala on värikoodattu ja merkitty ID-numerolla.
        {" "}
        <em>Tämä on yksinkertaistettu simulaatio.</em>
      </p>
    </div>
  );
}
