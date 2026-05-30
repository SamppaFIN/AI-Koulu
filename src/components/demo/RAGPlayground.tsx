"use client";

import { useState } from "react";

/**
 * RAG-leikkikenttä: mockattu vektorihaku + generointi.
 * Havainnollistaa RAG-putken "hae konteksti → generoi vastaus" -vaiheita.
 */

interface Chunk {
  id: number;
  text: string;
  relevance: number;
}

const DOCUMENTS: Record<string, Chunk[]> = {
  "mitä on rag": [
    { id: 1, text: "RAG (Retrieval-Augmented Generation) yhdistää tiedonhaun ja tekstin generoinnin.", relevance: 0.95 },
    { id: 2, text: "RAG-putki: chunkkaus → upotukset → vektoritietokanta → haku → generointi.", relevance: 0.92 },
    { id: 3, text: "RAG vähentää hallusinaatioita antamalla LLM:lle kontekstia omasta datasta.", relevance: 0.88 },
  ],
  "vektoritietokanta": [
    { id: 1, text: "Vektoritietokannat kuten Pinecone, Weaviate ja Qdrant indeksoivat upotukset.", relevance: 0.94 },
    { id: 2, text: "Haku tapahtuu kNN-haulla: lähimmät naapurit upotusavaruudessa.", relevance: 0.91 },
    { id: 3, text: "Upotusmallit muuttavat tekstin numeerisiksi vektoreiksi.", relevance: 0.85 },
  ],
  "hallusinaatio": [
    { id: 1, text: "Hallusinaatio on tilanne, jossa LLM tuottaa uskottavan mutta virheellisen vastauksen.", relevance: 0.96 },
    { id: 2, text: "RAG vähentää hallusinaatioita rajoittamalla LLM:n annettuun kontekstiin.", relevance: 0.93 },
  ],
};

const FALLBACK_CHUNKS: Chunk[] = [
  { id: 1, text: "RAG on keskeinen AI-arkkitehtuurimalli, joka parantaa LLM-vastausten laatua.", relevance: 0.65 },
  { id: 2, text: "Tiedonhaku ja generointi yhdessä muodostavat tehokkaan kokonaisuuden.", relevance: 0.62 },
];

function findChunks(query: string): Chunk[] {
  const normalized = query.toLowerCase().trim();
  for (const [key, chunks] of Object.entries(DOCUMENTS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return chunks;
    }
  }
  // Fallback: etsi sanoja
  const words = normalized.split(/\s+/);
  for (const word of words) {
    if (word.length < 3) continue;
    for (const [key, chunks] of Object.entries(DOCUMENTS)) {
      if (key.includes(word)) return chunks;
    }
  }
  return FALLBACK_CHUNKS;
}

function generateAnswer(chunks: Chunk[]): string {
  const topics = chunks.map((c) => c.text.split(" ").slice(0, 5).join(" "));
  return `Vastaus perustuu ${chunks.length} lähteeseen. ${chunks[0]?.text || ""} ${chunks[1]?.text || ""}`;
}

export default function RAGPlayground() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ chunks: Chunk[]; answer: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // Simuloi verkkoviivettä
    setTimeout(() => {
      const chunks = findChunks(query);
      const answer = generateAnswer(chunks);
      setResult({ chunks, answer });
      setIsSearching(false);
    }, 600);
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
        📚 RAG-leikkikenttä
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder='Kokeile: "mitä on RAG", "vektoritietokanta", "hallusinaatio"...'
          aria-label="Kysymys"
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg)",
            color: "var(--color-text)",
            fontSize: "0.95rem",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          style={{
            padding: "0.75rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            background: "var(--color-brand)",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            opacity: isSearching ? 0.6 : 1,
          }}
        >
          {isSearching ? "Haetaan..." : "Hae"}
        </button>
      </div>

      {result && (
        <div>
          <div
            style={{
              background: "color-mix(in oklab, var(--color-brand) 10%, var(--color-bg))",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--color-brand)" }}>
              🔍 Haetut dokumentit ({result.chunks.length} kpl)
            </p>
            {result.chunks.map((chunk) => (
              <div
                key={chunk.id}
                style={{
                  background: "var(--color-bg-card)",
                  borderRadius: "6px",
                  padding: "0.5rem 0.75rem",
                  marginBottom: "0.5rem",
                  borderLeft: "3px solid var(--color-brand-light)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.9rem" }}>{chunk.text}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    background: "color-mix(in oklab, var(--color-brand) 15%, transparent)",
                    color: "var(--color-brand)",
                    padding: "0.1rem 0.4rem",
                    borderRadius: "999px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {Math.round(chunk.relevance * 100)}%
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "color-mix(in oklab, var(--color-accent) 10%, var(--color-bg))",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--color-accent)" }}>
              🤖 Generoitu vastaus
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
              {result.answer}
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
              Vastaus laadittu lähteistä [1–{result.chunks.length}]
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
