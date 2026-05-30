"use client";

import { useEffect, useState } from "react";

const STORAGE_LAST_READ = "ai-koulu-last-read";

interface LastRead {
  slug: string;
  title: string;
  section: string;
  date: string;
}

/**
 * ContinueJourney — "Jatka siitä mihin jäit" -blokki etusivulla.
 * Tallentaa viimeksi luetun luvun localStorageen ja näyttää sen.
 */
export default function ContinueJourney() {
  const [lastRead, setLastRead] = useState<LastRead | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_LAST_READ);
      if (stored) {
        const data = JSON.parse(stored) as LastRead;
        // Näytä vain jos erotus on alle 7 päivää
        const daysAgo = (Date.now() - new Date(data.date).getTime()) / 86400000;
        if (daysAgo < 7) {
          setLastRead(data);
        }
      }
    } catch {
      // Hiljainen
    }

    // Päivitä aina kun käyttäjä palaa etusivulle
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_LAST_READ);
        if (stored) setLastRead(JSON.parse(stored));
      } catch {}
    };
    window.addEventListener("storage", handleStorage);
    // Kuuntele myös progress-update (kun luku merkitään luetuksi)
    window.addEventListener("progress-update", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("progress-update", handleStorage);
    };
  }, []);

  // Eksportoi tallennusfunktio, jota ProgressWrapper käyttää
  if (typeof window !== "undefined") {
    (window as any).__saveLastRead = (slug: string, title: string, section: string) => {
      const data: LastRead = { slug, title, section, date: new Date().toISOString() };
      localStorage.setItem(STORAGE_LAST_READ, JSON.stringify(data));
    };
  }

  if (!lastRead) return null;

  const basePath = lastRead.slug.startsWith("0") || lastRead.slug.startsWith("02") || lastRead.slug.startsWith("03") || lastRead.slug.startsWith("04") || lastRead.slug.startsWith("05")
    ? "/AI-Koulu/ai-architecture"
    : "/AI-Koulu/ui-ux";

  return (
    <div
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--glass-border)",
        borderRadius: "16px",
        padding: "1.5rem 2rem",
        marginBottom: "2rem",
        boxShadow: "0 4px 20px oklch(0.55 0.24 280 / 0.15)",
        position: "relative",
        overflow: "hidden",
        animation: "auroraFloat 4s ease-in-out infinite",
      }}
      role="region"
      aria-label="Jatka lukemista"
    >
      {/* Glow-reuna */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "var(--aurora-gradient-full)",
          animation: "cardGlow 3s linear infinite",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "2rem" }}>📍</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 0.15rem 0", fontWeight: 600, fontSize: "0.95rem" }}>
            Jatka matkaa
          </p>
          <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
            Olit viimeksi luvussa <strong style={{ color: "var(--color-brand)" }}>{lastRead.title}</strong>
          </p>
        </div>
        <a
          href={`${basePath}/${lastRead.slug}/`}
          style={{
            padding: "0.6rem 1.5rem",
            border: "none",
            borderRadius: "10px",
            background: "var(--aurora-gradient-1)",
            color: "white",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            textDecoration: "none",
            fontFamily: "inherit",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 15px oklch(0.55 0.24 280 / 0.3)",
          }}
        >
          Jatka lukemista →
        </a>
      </div>
    </div>
  );
}
