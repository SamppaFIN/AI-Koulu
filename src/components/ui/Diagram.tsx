interface DiagramProps {
  type: string;
  children?: React.ReactNode;
}

/**
 * Diagram-komponentti on paikanvaraaja interaktiivisia kaavioita varten.
 * Vaiheessa 3 tämä korvataan oikeilla React Flow -komponenteilla.
 */
export default function Diagram({ type, children }: DiagramProps) {
  return (
    <div
      style={{
        background: "var(--color-bg-card)",
        border: "2px dashed var(--color-border)",
        borderRadius: "12px",
        padding: "3rem 2rem",
        marginBlock: "1.5rem",
        textAlign: "center",
        color: "var(--color-text-muted)",
      }}
    >
      <p style={{ fontSize: "2rem", margin: "0 0 0.5rem 0" }}>📐</p>
      <p style={{ fontWeight: 600, margin: "0 0 0.25rem 0" }}>
        Kaavio: {type}
      </p>
      <p style={{ fontSize: "0.85rem", margin: 0 }}>
        Interaktiivinen diagrammi tulossa vaiheessa 3.
      </p>
      {children && <div style={{ marginTop: "1rem" }}>{children}</div>}
    </div>
  );
}
