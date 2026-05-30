"use client";

import { useState } from "react";

/**
 * Agenttisimulaatio: havainnollistaa ReAct-silmukkaa.
 * Agentti vastaanottaa tehtävän, päättää työkalun, suorittaa sen ja palauttaa tuloksen.
 */

type ToolType = "weather" | "calculator" | "search";

interface LogEntry {
  type: "thought" | "action" | "observation" | "result";
  content: string;
}

const TOOL_RESULTS: Record<ToolType, (input: string) => string> = {
  weather: (input) => {
    const cities: Record<string, string> = {
      helsinki: "Aurinkoista, 22°C, tuuli 3 m/s",
      tampere: "Puolipilvistä, 18°C, tuuli 5 m/s",
      turku: "Sadetta, 15°C, tuuli 8 m/s",
      oulu: "Pilvistä, 12°C, tuuli 6 m/s",
      default: "Aurinkoista, 20°C, tuuli 4 m/s",
    };
    const city = input.toLowerCase().trim();
    return cities[city] || cities.default;
  },
  calculator: (input) => {
    try {
      // Turvallinen laskin — vain peruslaskutoimitukset
      const sanitized = input.replace(/[^0-9+\-*/().]/g, "");
      if (!sanitized) return "Virhe: ei laskettavaa";
      const result = Function(`"use strict"; return (${sanitized})`)();
      return `Tulos: ${result}`;
    } catch {
      return "Virhe: kelpaamaton laskutoimitus";
    }
  },
  search: (input) => {
    const results: Record<string, string> = {
      "rag": "RAG on Retrieval-Augmented Generation -arkkitehtuuri...",
      "agentit": "Agentit ovat AI-järjestelmiä, jotka käyttävät työkaluja...",
      "default": `Löytyi 5 tulosta haulle "${input}"`,
    };
    return results[input.toLowerCase().trim()] || results.default;
  },
};

function simulateAgent(task: string, tool: ToolType, input: string): LogEntry[] {
  const logs: LogEntry[] = [];
  logs.push({ type: "thought", content: `Tehtävä: "${task}". Valitsen sopivan työkalun...` });
  logs.push({ type: "action", content: `Käytetään työkalua: ${getToolName(tool)}` });
  logs.push({ type: "action", content: `Syöte: "${input}"` });
  const result = TOOL_RESULTS[tool](input);
  logs.push({ type: "observation", content: `Työkalun tulos: ${result}` });
  logs.push({ type: "result", content: `Lopullinen vastaus: Tehtävä suoritettu. ${result}` });
  return logs;
}

function getToolName(tool: ToolType): string {
  const names: Record<ToolType, string> = {
    weather: "🌤️ Sää-API",
    calculator: "🧮 Laskin",
    search: "🔍 Tietokantahaku",
  };
  return names[tool];
}

const EXAMPLE_TASKS = [
  { label: "Mikä on sää Helsingissä?", tool: "weather" as ToolType, input: "Helsinki" },
  { label: "Paljonko on 15 * 7 + 3?", tool: "calculator" as ToolType, input: "15 * 7 + 3" },
  { label: "Mitä RAG tarkoittaa?", tool: "search" as ToolType, input: "RAG" },
];

export default function AgentSimulation() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTask = (task: typeof EXAMPLE_TASKS[0]) => {
    setLogs([]);
    setIsRunning(true);
    const newLogs = simulateAgent(task.label, task.tool, task.input);
    // Lisää logit yksi kerrallaan animaatiota varten
    newLogs.forEach((log, i) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
        if (i === newLogs.length - 1) setIsRunning(false);
      }, (i + 1) * 500);
    });
  };

  const typeStyles: Record<string, React.CSSProperties> = {
    thought: { borderLeftColor: "var(--color-info)", background: "color-mix(in oklab, var(--color-info) 8%, var(--color-bg))" },
    action: { borderLeftColor: "var(--color-accent)", background: "color-mix(in oklab, var(--color-accent) 8%, var(--color-bg))" },
    observation: { borderLeftColor: "var(--color-success)", background: "color-mix(in oklab, var(--color-success) 8%, var(--color-bg))" },
    result: { borderLeftColor: "var(--color-brand)", background: "color-mix(in oklab, var(--color-brand) 10%, var(--color-bg))" },
  };

  const typeLabels: Record<string, string> = {
    thought: "💭 Päättely",
    action: "⚡ Toiminta",
    observation: "👁️ Havainto",
    result: "✅ Tulos",
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
        🤖 Agenttisimulaatio (ReAct-silmukka)
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {EXAMPLE_TASKS.map((task) => (
          <button
            key={task.label}
            onClick={() => runTask(task)}
            disabled={isRunning}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              cursor: isRunning ? "not-allowed" : "pointer",
              fontSize: "0.85rem",
              opacity: isRunning ? 0.6 : 1,
            }}
          >
            {task.label}
          </button>
        ))}
      </div>

      <div
        style={{
          background: "var(--color-bg)",
          borderRadius: "8px",
          border: "1px solid var(--color-border)",
          padding: "1rem",
          minHeight: "150px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.85rem",
        }}
        role="log"
        aria-label="Agenttiloki"
      >
        {logs.length === 0 && (
          <p style={{ color: "var(--color-text-muted)", textAlign: "center", margin: "2rem 0" }}>
            Valitse tehtävä ylhäältä nähdäksesi agentin päättelysilmukan
          </p>
        )}
        {logs.map((log, i) => (
          <div
            key={i}
            style={{
              padding: "0.5rem 0.75rem",
              marginBottom: "0.5rem",
              borderRadius: "6px",
              borderLeft: "3px solid var(--color-border)",
              ...typeStyles[log.type],
              animation: i === logs.length - 1 ? "fadeIn 0.3s ease" : "none",
            }}
          >
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-muted)" }}>
              {typeLabels[log.type]}
            </span>
            <p style={{ margin: "0.25rem 0 0 0", lineHeight: 1.5 }}>{log.content}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
