"use client";

import { useState } from "react";

/**
 * Saavutettavuuslabra: lomake, jossa on tahallisia a11y-virheitä.
 * Käyttäjä löytää virheet ja saa pisteitä.
 */

interface Issue {
  id: string;
  label: string;
  description: string;
  found: boolean;
}

const ALL_ISSUES: Issue[] = [
  { id: "missing-label", label: "Puuttuva label", description: "Sähköpostikentällä ei ole aria-labelia eikä näkyvää labelia", found: false },
  { id: "low-contrast", label: "Huono kontrasti", description: "Virheviestin vaaleanpunainen teksti vaalealla taustalla on vaikealukuista", found: false },
  { id: "no-focus", label: "Puuttuva focus-indikaattori", description: "Lähetä-painikkeella ei näy focus-rengasta", found: false },
  { id: "empty-button", label: "Tyhjä painike", description: "Sulje-painikkeessa on vain X-merkki ilman aria-labelia", found: false },
  { id: "missing-alt", label: "Puuttuva alt-teksti", description: "Kuvalla ei ole alt-tekstiä", found: false },
];

export default function AccessibilityLab() {
  const [issues, setIssues] = useState<Issue[]>(ALL_ISSUES);
  const [foundCount, setFoundCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reportIssue = (id: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id && !i.found ? { ...i, found: true } : i))
    );
    setFoundCount((prev) => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const total = issues.length;
  const found = issues.filter((i) => i.found).length;

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
        ♿ Saavutettavuuslabra
      </p>
      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
        Löydä {total} saavutettavuusongelmaa lomakkeesta. Klikkaa ongelmaa löydettyäsi sen.
      </p>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        {/* Lomake (tahallisilla virheillä) */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          <form
            onSubmit={handleSubmit}
            style={{
              background: "var(--color-bg)",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              padding: "1.25rem",
            }}
          >
            {/* BUGBUG: puuttuu label, vain placeholder */}
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.25rem" }}>Nimi</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Syötä nimesi"
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-card)",
                  color: "var(--color-text)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* BUGBUG: puuttuu label-elementti, pelkkä placeholder */}
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Sähköposti"
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-card)",
                  color: "var(--color-text)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* BUGBUG: huono kontrasti virheviestissä */}
            {submitted && (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#FF9999", /* Huono kontrasti valkoisella taustalla */
                  background: "#FFF5F5",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  marginBottom: "0.75rem",
                }}
              >
                Virhe: täytä kaikki kentät
              </p>
            )}

            {/* BUGBUG: ei focus-tyyliä */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                border: "none",
                background: "var(--color-brand)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                /* outline: none — tahallinen a11y-virhe */
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.outline = "none")}
            >
              Lähetä
            </button>
          </form>

          {/* BUGBUG: painikkeessa vain X, ei aria-labelia */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "0.5rem",
            }}
          >
            <button
              onClick={() => reportIssue("empty-button")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                padding: "0.25rem 0.5rem",
              }}
              title="Sulje (tahallaan ilman aria-labelia)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Ongelmalista */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Löydetyt ongelmat: {found}/{total}
          </p>

          <div
            style={{
              background: "color-mix(in oklab, var(--color-success) 10%, var(--color-bg))",
              borderRadius: "8px",
              padding: "0.75rem",
              marginBottom: "0.75rem",
              display: found === total ? "block" : "none",
            }}
          >
            <p style={{ fontWeight: 600, margin: 0, color: "var(--color-success)" }}>
              🎉 Kaikki ongelmat löydetty!
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {issues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => reportIssue(issue.id)}
                disabled={issue.found}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "6px",
                  border: `1px solid ${issue.found ? "var(--color-success)" : "var(--color-border)"}`,
                  background: issue.found ? "color-mix(in oklab, var(--color-success) 10%, var(--color-bg))" : "var(--color-bg)",
                  cursor: issue.found ? "default" : "pointer",
                  textAlign: "left",
                  width: "100%",
                  color: "var(--color-text)",
                  fontSize: "0.85rem",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>
                  {issue.found ? "✅" : "⬜"}
                </span>
                <div>
                  <span style={{ fontWeight: 600, display: "block", marginBottom: "0.15rem" }}>
                    {issue.label}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    {issue.found ? issue.description : "Klikkaa löydettyäsi tämän ongelman"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Vihje-painike */}
          {found < total && (
            <button
              onClick={() => setShowHint(!showHint)}
              style={{
                marginTop: "0.75rem",
                padding: "0.4rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                cursor: "pointer",
                fontSize: "0.8rem",
                color: "var(--color-text-secondary)",
              }}
            >
              {showHint ? "Piilota vihje" : "Näytä vihje"}
            </button>
          )}

          {showHint && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--color-accent)", background: "color-mix(in oklab, var(--color-accent) 8%, var(--color-bg))", borderRadius: "6px", padding: "0.5rem 0.75rem" }}>
              <strong>Vihje:</strong> Tutki labelit, kontrastit, focus-tyylit, painikkeiden saavutettavuus ja kuvien alt-tekstit.
            </div>
          )}

          <button
            onClick={() => { setIssues(ALL_ISSUES); setFoundCount(0); setShowHint(false); setSubmitted(false); setName(""); setEmail(""); }}
            style={{
              marginTop: "0.5rem",
              padding: "0.4rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              cursor: "pointer",
              fontSize: "0.8rem",
              color: "var(--color-text-secondary)",
            }}
          >
            🔄 Aloita alusta
          </button>
        </div>
      </div>
    </div>
  );
}
