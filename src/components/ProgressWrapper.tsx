"use client";

import { useEffect } from "react";
import { useProgressTracker } from "./ProgressTracker";

interface ChapterInfo {
  slug: string;
  title: string;
  section: string;
}

export default function ProgressTrackerWrapper({ slug, title, section }: { slug: string; title: string; section: string }) {
  useProgressTracker(slug);

  useEffect(() => {
    // Tallenna viimeksi luettu luku
    if (typeof window !== "undefined" && (window as any).__saveLastRead) {
      (window as any).__saveLastRead(slug, title, section);
    }
  }, [slug, title, section]);

  return null;
}
