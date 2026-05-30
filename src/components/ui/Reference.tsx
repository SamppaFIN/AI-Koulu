"use client";

import referencesData from "../../data/references.json";

interface ReferenceProps {
  id: string;
}

interface RefEntry {
  id: string;
  authors: string;
  title: string;
  year: number;
  venue: string;
  url: string;
  doi?: string;
}

export default function Reference({ id }: ReferenceProps) {
  const ref = (referencesData as RefEntry[]).find((r) => r.id === id);

  if (!ref) {
    console.warn(`Reference not found: ${id}`);
    return <sup style={{ color: "var(--color-error)" }}>[?{id}]</sup>;
  }

  return (
    <sup>
      <a
        href={ref.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${ref.authors} (${ref.year}). ${ref.title}. ${ref.venue}.`}
        style={{
          color: "var(--color-brand)",
          textDecoration: "none",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        [{ref.id}]
      </a>
    </sup>
  );
}
