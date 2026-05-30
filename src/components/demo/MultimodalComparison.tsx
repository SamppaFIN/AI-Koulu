"use client";

import { useState } from "react";

/**
 * Multimodaalinen vertailu: havainnollistaa miten AI käsittelee
 * kuvia ja tekstiä yhdessä. Simuloi kuvan analyysiä ja huomiokarttaa.
 */

interface ImagePair {
  label: string;
  emoji: string;
  description: string;
  details: string;
  attentionMap: { x: number; y: number; intensity: number }[];
}

const IMAGES: ImagePair[] = [
  {
    label: "Kissa",
    emoji: "🐱",
    description: "Kissa istuu ikkunalaudalla ja katsoo ulos. Sen turkki on oranssi ja raidallinen. Ikkunan takana näkyy puutarha.",
    details: "Kohde: kissa (felis catus)\nAsento: istuu, pää kääntyneenä oikealle\nTausta: ikkuna, puutarha, puita\nValaistus: luonnonvaloa, aamupäivä",
    attentionMap: [
      { x: 50, y: 40, intensity: 0.9 },
      { x: 45, y: 45, intensity: 0.7 },
      { x: 55, y: 35, intensity: 0.6 },
      { x: 30, y: 60, intensity: 0.3 },
    ],
  },
  {
    label: "Maisema",
    emoji: "🌅",
    description: "Auringonlasku järven yllä. Taivas on oranssin ja violetin sävyinen. Järven pinta heijastaa värejä. Taustalla on metsäinen ranta.",
    details: "Kohde: maisema (auringonlasku)\nElementit: järvi, taivas, metsä, pilviä\nVärit: oranssi, violetti, sininen, vihreä\nAika: iltahämärä",
    attentionMap: [
      { x: 50, y: 30, intensity: 0.95 },
      { x: 40, y: 35, intensity: 0.8 },
      { x: 60, y: 70, intensity: 0.5 },
      { x: 20, y: 50, intensity: 0.4 },
    ],
  },
  {
    label: "Koodi",
    emoji: "💻",
    description: "Tietokoneen näyttö, jolla näkyy Python-koodia. Koodi sisältää funktion määrittelyn ja for-silmukan. Taustalla on tumma teema.",
    details: "Kohde: koodieditori\nKieli: Python\nSisältö: funktio, silmukka, print\nTeema: tumma (dark mode)",
    attentionMap: [
      { x: 50, y: 40, intensity: 0.85 },
      { x: 50, y: 55, intensity: 0.75 },
      { x: 30, y: 30, intensity: 0.5 },
      { x: 70, y: 60, intensity: 0.4 },
    ],
  },
];

export default function MultimodalComparison() {
  const [selectedImage, setSelectedImage] = useState<ImagePair | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAttention, setShowAttention] = useState(false);

  const handleAnalyze = (img: ImagePair) => {
    setSelectedImage(img);
    setAnalyzing(true);
    setShowAttention(false);
    setTimeout(() => {
      setAnalyzing(false);
      setShowAttention(true);
    }, 1000);
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
      <p style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
        🖼️ Multimodaalinen vertailu
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {IMAGES.map((img) => (
          <button
            key={img.label}
            onClick={() => handleAnalyze(img)}
            disabled={analyzing}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1.5rem",
              borderRadius: "12px",
              border: selectedImage?.label === img.label ? "2px solid var(--color-brand-light)" : "1px solid var(--color-border)",
              background: "var(--color-bg)",
              cursor: analyzing ? "not-allowed" : "pointer",
              fontSize: "2rem",
              minWidth: "100px",
              opacity: analyzing ? 0.6 : 1,
              transition: "border-color 0.2s",
            }}
            aria-label={`Analysoi ${img.label}`}
          >
            <span>{img.emoji}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>{img.label}</span>
          </button>
        ))}
      </div>

      {analyzing && (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>
          <p style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0" }}>⏳</p>
          <p>Analysoidaan kuvaa... (simuloitu viive)</p>
        </div>
      )}

      {selectedImage && showAttention && (
        <div>
          {/* Huomiokartta (attention map) SVG-maskina */}
          <div
            style={{
              background: "var(--color-bg)",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <svg viewBox="0 0 100 100" style={{ width: "200px", height: "200px" }}>
              <rect width="100" height="100" fill="var(--color-bg-code)" rx="8" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize="40">
                {selectedImage.emoji}
              </text>
              {selectedImage.attentionMap.map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r={12 * point.intensity}
                  fill={`oklch(0.6 0.22 25 / ${point.intensity * 0.4})`}
                  opacity={0.6 + point.intensity * 0.4}
                >
                  <animate
                    attributeName="r"
                    values={`${8 * point.intensity};${14 * point.intensity};${8 * point.intensity}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </svg>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", margin: "0.5rem 0 0 0" }}>
              Huomiokartta (attention map) — lämpimät alueet = korkein huomio
            </p>
          </div>

          {/* Tekstikuvaus */}
          <div
            style={{
              background: "color-mix(in oklab, var(--color-brand) 10%, var(--color-bg))",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--color-brand)" }}>
              📝 Kuvaus
            </p>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              {selectedImage.description}
            </p>
          </div>

          {/* Yksityiskohdat */}
          <div
            style={{
              background: "color-mix(in oklab, var(--color-info) 8%, var(--color-bg))",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--color-info)" }}>
              🔍 Analyysin yksityiskohdat
            </p>
            <pre
              style={{
                margin: 0,
                fontSize: "0.8rem",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                fontFamily: "var(--font-mono)",
              }}
            >
              {selectedImage.details}
            </pre>
          </div>
        </div>
      )}

      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.75rem" }}>
        Klikkaa kuvaa simuloidaksesi AI:n multimodaalista analyysiä.
        Huomiokartta näyttää mille alueille malli "katsoo".
      </p>
    </div>
  );
}
