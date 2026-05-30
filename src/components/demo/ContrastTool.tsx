"use client";

import { useState, useMemo } from "react";

/**
 * Värikontrastityökalu: APCA-laskenta WCAG-kontrasteille.
 * Liu'uilla valitaan tausta- ja tekstivärit, demo kertoo kontrastisuhteen.
 */

function hexToOklch(hex: string): { l: number; c: number; h: number } {
  // Yksinkertaistettu: muunna heksadesimaali RGB:ksi, sitten arvioi OKLCH
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // Yksinkertaistettu luminanssi (sRGB)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return { l: luminance, c: Math.abs(luminance - 0.5) * 0.3, h: 0 };
}

function apcaContrast(textHex: string, bgHex: string): number {
  const textLum = hexToOklch(textHex).l;
  const bgLum = hexToOklch(bgHex).l;

  // Yksinkertaistettu APCA-laskenta
  const textLin = textLum <= 0.04045 ? textLum / 12.92 : Math.pow((textLum + 0.055) / 1.055, 2.4);
  const bgLin = bgLum <= 0.04045 ? bgLum / 12.92 : Math.pow((bgLum + 0.055) / 1.055, 2.4);

  const contrast = (Math.max(textLin, bgLin) + 0.05) / (Math.min(textLin, bgLin) + 0.05);
  return Math.round((contrast - 1) * 100);
}

function getWcagLevel(contrast: number): { level: string; pass: boolean; aa: boolean; aaa: boolean } {
  const ratio = (contrast / 100) + 1;
  return {
    level: ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA (large)" : "Fail",
    pass: ratio >= 4.5,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
  };
}

const PRESETS = [
  { name: "Musta & valkoinen", text: "#000000", bg: "#ffffff" },
  { name: "Brand & valkoinen", text: "#6B3FA0", bg: "#ffffff" },
  { name: "Musta & keltainen", text: "#000000", bg: "#FFD700" },
  { name: "Harmaa & harmaa", text: "#666666", bg: "#f0f0f0" },
  { name: "Valkoinen & tumma", text: "#ffffff", bg: "#1a1a2e" },
];

export default function ContrastTool() {
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const contrast = useMemo(() => apcaContrast(textColor, bgColor), [textColor, bgColor]);
  const wcag = useMemo(() => getWcagLevel(contrast), [contrast]);

  const setPreset = (text: string, bg: string) => {
    setTextColor(text);
    setBgColor(bg);
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
        🎨 Värikontrastityökalu (APCA)
      </p>

      {/* Esikatselu */}
      <div
        style={{
          background: bgColor,
          color: textColor,
          borderRadius: "8px",
          padding: "2rem",
          marginBottom: "1rem",
          textAlign: "center",
          border: "1px solid var(--color-border)",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        <p style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.25rem 0" }}>
          Esimerkkiteksti
        </p>
        <p style={{ fontSize: "0.9rem", margin: 0, opacity: 0.8 }}>
          Tämä on esimerkki tekstistä tällä kontrastilla
        </p>
      </div>

      {/* Värisäätimet */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div style={{ flex: 1, minWidth: "150px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
            Tekstin väri
          </label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              aria-label="Valitse tekstin väri"
              style={{ width: "3rem", height: "2.5rem", border: "none", borderRadius: "4px", cursor: "pointer" }}
            />
            <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>{textColor}</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: "150px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
            Taustan väri
          </label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              aria-label="Valitse taustan väri"
              style={{ width: "3rem", height: "2.5rem", border: "none", borderRadius: "4px", cursor: "pointer" }}
            />
            <span style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>{bgColor}</span>
          </div>
        </div>
      </div>

      {/* Kontrastitulos */}
      <div
        style={{
          background: "var(--color-bg)",
          borderRadius: "8px",
          padding: "1rem",
          border: "1px solid var(--color-border)",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontWeight: 600 }}>APCA-kontrasti:</span>
          <span style={{ fontWeight: 700, fontSize: "1.3rem", color: wcag.pass ? "var(--color-success)" : "var(--color-error)" }}>
            {contrast}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span
            style={{
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 600,
              background: wcag.aaa ? "color-mix(in oklab, var(--color-success) 20%, transparent)" : "color-mix(in oklab, var(--color-error) 15%, transparent)",
              color: wcag.aaa ? "var(--color-success)" : "var(--color-error)",
            }}
          >
            AAA {wcag.aaa ? "✅" : "❌"}
          </span>
          <span
            style={{
              padding: "0.2rem 0.6rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 600,
              background: wcag.aa ? "color-mix(in oklab, var(--color-success) 20%, transparent)" : "color-mix(in oklab, var(--color-error) 15%, transparent)",
              color: wcag.aa ? "var(--color-success)" : "var(--color-error)",
            }}
          >
            AA {wcag.aa ? "✅" : "❌"}
          </span>
        </div>
      </div>

      {/* Esiasetukset */}
      <div>
        <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Esiasetukset
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setPreset(preset.text, preset.bg)}
              style={{
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                cursor: "pointer",
                fontSize: "0.8rem",
                color: "var(--color-text-secondary)",
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
