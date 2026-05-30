"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface SearchResult {
  id: string;
  score: number;
  url: string;
  meta: {
    title: string;
    description: string;
  };
  excerpt: string;
}

/**
 * Hakupalkki, joka käyttää Pagefind:iä staattiseen hakuun.
 * Lataa Pagefind-indeksin ensimmäisellä hakukerralla.
 */
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const pagefindRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadPagefind = useCallback(async () => {
    if (pagefindRef.current) return;
    try {
      // Lataa Pagefind-indeksi ajonaikaisesti
      // Vite ei saa yrittää resolvata tätä buildissa
      const base = typeof window !== 'undefined'
        ? (document.querySelector('base')?.getAttribute('href') || '/AI-Koulu/')
        : '/AI-Koulu/';
      const pagefindUrl = base + 'pagefind/pagefind.js';

      // Luo dynaaminen script-tagi Pagefindille
      const script = document.createElement('script');
      script.src = pagefindUrl;
      script.type = 'module';
      script.onload = () => {
        // Pagefind rekisteröi itsensä globaaliksi
        if (typeof (window as any).pagefind !== 'undefined') {
          pagefindRef.current = (window as any).pagefind;
        }
        setIsLoaded(true);
      };
      script.onerror = () => {
        console.warn("Pagefind ei latautunut");
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    } catch {
      console.warn("Pagefind: virhe latauksessa");
      setIsLoaded(true);
    }
  }, []);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const pf = pagefindRef.current || (window as any).pagefind;
    if (!pf) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const search = await pf.search(value);
      if (search && search.results) {
        const data = await Promise.all(
          search.results.slice(0, 10).map((r: any) => r.data())
        );
        setResults(
          data.map((d: any) => ({
            id: d.id,
            score: d.score || 0,
            url: d.url,
            meta: d.meta,
            excerpt: d.excerpt || "",
          }))
        );
      }
    } catch {
      // Hiljainen epäonnistuminen
    }
    setIsSearching(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      // Debounce haku
      const timer = setTimeout(() => handleSearch(value), 300);
      return () => clearTimeout(timer);
    },
    [handleSearch]
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          background: "var(--color-bg-card)",
          border: `1px solid ${query ? "var(--color-brand-light)" : "var(--color-border)"}`,
          borderRadius: "12px",
          padding: "0.75rem 1rem",
          transition: "border-color 0.2s",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>🔍</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onFocus={loadPagefind}
          placeholder="Hae koko sivustosta..."
          aria-label="Hae"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            color: "var(--color-text)",
            fontSize: "1rem",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        {isSearching && (
          <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
            Haetaan...
          </span>
        )}
      </div>

      {/* Tulokset */}
      {hasSearched && query.trim() && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "0.5rem",
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {results.length === 0 && !isSearching && (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-text-muted)" }}>
              <p style={{ margin: 0 }}>Ei tuloksia haulle "{query}"</p>
              <p style={{ fontSize: "0.85rem", margin: "0.5rem 0 0 0" }}>
                Kokeile toista hakusanaa
              </p>
            </div>
          )}

          {results.map((result) => (
            <a
              key={result.id}
              href={result.url}
              style={{
                display: "block",
                padding: "0.75rem 1rem",
                textDecoration: "none",
                color: "var(--color-text)",
                borderBottom: "1px solid var(--color-border-light)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "var(--color-surface)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "transparent";
              }}
            >
              <p style={{ margin: "0 0 0.2rem 0", fontWeight: 600, fontSize: "0.95rem" }}>
                {result.meta.title}
              </p>
              <p
                style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-secondary)" }}
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
