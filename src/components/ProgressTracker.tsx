"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ai-koulu-progress";

interface Progress {
  [slug: string]: {
    read: boolean;
    date: string;
  };
}

function getProgress(): Progress {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(slug: string) {
  const progress = getProgress();
  progress[slug] = { read: true, date: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * ProgressTracker — merkkaa luku luetuksi kun 80% vieritetty.
 * Aseta data-progress-slug="slug" elementtiin, jota seurataan.
 */
export function useProgressTracker(slug: string | undefined) {
  useEffect(() => {
    if (!slug) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY / scrollHeight;

      if (scrolled > 0.8) {
        saveProgress(slug);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);
}

/**
 * Näytä edistyminen tietylle kokoelma-arraylle.
 */
interface ProgressBarProps {
  items: { id: string; title: string }[];
  basePath: string;
}

export function ChapterProgress({ items, basePath }: ProgressBarProps) {
  const [progress, setProgress] = useState<Progress>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setMounted(true);

    // Päivitä kun localStorage muuttuu (scroll-tracking)
    const handleStorage = () => setProgress(getProgress());
    window.addEventListener("storage", handleStorage);
    // Myös custom event progress-scrollille
    window.addEventListener("progress-update", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("progress-update", handleStorage);
    };
  }, []);

  if (!mounted) return null;

  const total = items.length;
  const read = items.filter((item) => progress[item.id]?.read).length;
  const pct = total > 0 ? Math.round((read / total) * 100) : 0;

  return (
    <div
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Edistyminen</span>
        <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
          {read}/{total} lukua ({pct}%)
        </span>
      </div>
      <div
        style={{
          height: "6px",
          background: "var(--color-bg-code)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "var(--color-brand)",
            borderRadius: "999px",
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}
