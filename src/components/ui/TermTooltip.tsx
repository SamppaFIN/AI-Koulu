import glossaryData from "../../data/glossary.json";

interface GlossaryEntry {
  id: string;
  term: string;
  shortDef: string;
  fullDef: string;
  examples: string[];
  relatedTerms: string[];
  chapter: string;
  difficulty: "beginner" | "intermediate";
}

interface TermTooltipProps {
  term: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

const styles = `
.glossary-term {
  position: relative;
  display: inline;
  cursor: help;
  border-bottom: 2px dotted oklch(0.6 0.18 240 / 0.6);
  font-weight: 500;
  color: oklch(0.55 0.18 240 / 1);
}
.glossary-term .glossary-popup {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s ease, visibility 0.15s ease;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  min-width: 280px;
  max-width: 400px;
  background: oklch(0.25 0.01 280 / 1);
  border: 1px solid oklch(0.5 0.02 280 / 0.2);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  font-size: 0.85rem;
  line-height: 1.5;
  color: oklch(0.9 0.01 280 / 1);
  text-align: left;
  pointer-events: none;
}
.glossary-term:hover .glossary-popup,
.glossary-term:focus-within .glossary-popup {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
}
@media (max-width: 640px) {
  .glossary-term .glossary-popup {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;
    min-width: auto;
    max-width: none;
    border-radius: 12px 12px 0 0;
  }
}
`;

export default function TermTooltip({ term, children, showIcon = true }: TermTooltipProps) {
  const entry = (glossaryData as GlossaryEntry[]).find(
    (e) => e.id === term || e.term.toLowerCase() === term.toLowerCase()
  );

  if (!entry) {
    console.warn(`Glossary term not found: ${term}`);
    return <>{children || term}</>;
  }

  return (
    <>
      <style>{styles}</style>
      <span
        className="glossary-term"
        tabIndex={0}
        role="button"
        aria-describedby={`glossary-${entry.id}`}
      >
        {children || entry.term}
        {showIcon && (
          <span style={{ fontSize: "0.75em", marginLeft: "2px", opacity: 0.7 }}>ⓘ</span>
        )}

        <span id={`glossary-${entry.id}`} className="glossary-popup">
          <strong style={{ fontSize: "1rem", display: "block", marginBottom: "4px" }}>
            {entry.term}
          </strong>

          <p style={{ margin: "0 0 8px", opacity: 0.9 }}>{entry.shortDef}</p>

          <span style={{
            display: "inline-block",
            padding: "1px 8px",
            borderRadius: "4px",
            fontSize: "0.7rem",
            fontWeight: 600,
            background: entry.difficulty === "beginner"
              ? "oklch(0.6 0.2 150 / 0.2)"
              : "oklch(0.6 0.18 240 / 0.2)",
            color: entry.difficulty === "beginner"
              ? "oklch(0.6 0.2 150 / 1)"
              : "oklch(0.6 0.18 240 / 1)",
          }}>
            {entry.difficulty === "beginner" ? "Aloittelija" : "Keskitaso"}
          </span>

          {entry.examples.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.6, display: "block", marginBottom: "4px" }}>
                ESIMERKIT:
              </span>
              <ul style={{ margin: 0, paddingLeft: "16px", opacity: 0.85 }}>
                {entry.examples.slice(0, 2).map((ex, i) => (
                  <li key={i} style={{ marginBottom: "2px", fontSize: "0.8rem" }}>{ex}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: "10px", textAlign: "right" }}>
            <a
              href={`/AI-Koulu/sanasto/#${entry.id}`}
              style={{
                fontSize: "0.75rem",
                color: "oklch(0.6 0.18 240 / 0.8)",
                textDecoration: "none",
              }}
            >
              Lue lisää sanastosta →
            </a>
          </div>
        </span>
      </span>
    </>
  );
}
