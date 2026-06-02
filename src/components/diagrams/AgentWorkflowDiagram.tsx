"use client";

import { useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/** Agenttityönkulun (ReAct-kuvion) visualisointi React Flow'lla */

const nodeStyles: Record<string, React.CSSProperties> = {
  user: {
    background: "oklch(0.6 0.18 240 / 0.12)",
    border: "1px solid oklch(0.6 0.18 240 / 0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "var(--color-text)",
    fontSize: "0.82rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "130px",
  },
  agent: {
    background: "oklch(0.55 0.24 280 / 0.12)",
    border: "1px solid oklch(0.55 0.24 280 / 0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "var(--color-text)",
    fontSize: "0.82rem",
    fontWeight: 700,
    textAlign: "center",
    minWidth: "140px",
  },
  action: {
    background: "oklch(0.6 0.2 150 / 0.12)",
    border: "1px solid oklch(0.6 0.2 150 / 0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "var(--color-text)",
    fontSize: "0.82rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "140px",
  },
  tool: {
    background: "oklch(0.65 0.2 85 / 0.12)",
    border: "1px solid oklch(0.65 0.2 85 / 0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "var(--color-text)",
    fontSize: "0.82rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "140px",
  },
  obs: {
    background: "oklch(0.55 0.22 180 / 0.12)",
    border: "1px solid oklch(0.55 0.22 180 / 0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "var(--color-text)",
    fontSize: "0.82rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "130px",
  },
  answer: {
    background: "oklch(0.55 0.2 130 / 0.12)",
    border: "1px solid oklch(0.55 0.2 130 / 0.35)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "var(--color-text)",
    fontSize: "0.82rem",
    fontWeight: 700,
    textAlign: "center",
    minWidth: "140px",
  },
};

function UserNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.user}>
      <Handle type="source" position={Position.Bottom} style={{ background: "oklch(0.6 0.18 240 / 0.5)" }} />
      <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>👤</div>
      {data.label}
    </div>
  );
}

function AgentNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.agent}>
      <Handle type="target" position={Position.Top} style={{ background: "oklch(0.55 0.24 280 / 0.5)" }} />
      <Handle type="source" position={Position.Right} style={{ background: "oklch(0.55 0.24 280 / 0.5)", top: "35%" }} id="act" />
      <Handle type="source" position={Position.Bottom} style={{ background: "oklch(0.55 0.24 280 / 0.5)" }} id="final" />
      <Handle type="target" position={Position.Left} style={{ background: "oklch(0.55 0.24 280 / 0.5)", top: "65%" }} id="obsIn" />
      <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>🤖</div>
      {data.label}
    </div>
  );
}

function ActionNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.action}>
      <Handle type="target" position={Position.Left} style={{ background: "oklch(0.6 0.2 150 / 0.5)" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "oklch(0.6 0.2 150 / 0.5)" }} />
      <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>⚡</div>
      {data.label}
    </div>
  );
}

function ToolNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.tool}>
      <Handle type="target" position={Position.Top} style={{ background: "oklch(0.65 0.2 85 / 0.5)" }} />
      <Handle type="source" position={Position.Left} style={{ background: "oklch(0.65 0.2 85 / 0.5)", top: "50%" }} id="obsOut" />
      <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>🔧</div>
      {data.label}
    </div>
  );
}

function ObsNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.obs}>
      <Handle type="target" position={Position.Left} style={{ background: "oklch(0.55 0.22 180 / 0.5)" }} />
      <Handle type="source" position={Position.Right} style={{ background: "oklch(0.55 0.22 180 / 0.5)", top: "50%" }} id="backToAgent" />
      <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>👁️</div>
      {data.label}
    </div>
  );
}

function AnswerNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.answer}>
      <Handle type="target" position={Position.Top} style={{ background: "oklch(0.55 0.2 130 / 0.5)" }} />
      <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>✅</div>
      {data.label}
    </div>
  );
}

const nodeTypes = {
  user: UserNode,
  agent: AgentNode,
  action: ActionNode,
  tool: ToolNode,
  obs: ObsNode,
  answer: AnswerNode,
};

const defaultNodes: Node[] = [
  // User
  { id: "user", type: "user", position: { x: 80, y: 0 }, data: { label: "Käyttäjän\nkysymys" } },

  // Agent (central)
  { id: "agent", type: "agent", position: { x: 80, y: 110 }, data: { label: "Agentti\n🧠 Ajattelu" } },

  // Action → Tool chain (right side)
  { id: "action", type: "action", position: { x: 320, y: 80 }, data: { label: "Toiminto\n(Action)" } },
  { id: "tool", type: "tool", position: { x: 320, y: 200 }, data: { label: "Työkalu\n(API, haku)" } },
  { id: "obs", type: "obs", position: { x: 150, y: 200 }, data: { label: "Havainto\n(Observation)" } },

  // Loop indicator
  { id: "loop", type: "agent", position: { x: 80, y: 310 }, data: { label: "Agentti\n🔄 Päättele\nseuraava askel" } },

  // Final answer
  { id: "answer", type: "answer", position: { x: 80, y: 430 }, data: { label: "Lopullinen\nvastaus" } },
];

const defaultEdges: Edge[] = [
  // User → Agent
  { id: "e-user-agent", source: "user", target: "agent", animated: true, style: { stroke: "oklch(0.6 0.18 240 / 0.4)" }, label: "kysymys" },

  // Agent → Action
  { id: "e-agent-action", source: "agent", target: "action", sourceHandle: "act", animated: true, style: { stroke: "oklch(0.55 0.24 280 / 0.4)" }, label: "päätös" },

  // Action → Tool
  { id: "e-action-tool", source: "action", target: "tool", animated: true, style: { stroke: "oklch(0.6 0.2 150 / 0.4)" }, label: "kutsu" },

  // Tool → Observation
  { id: "e-tool-obs", source: "tool", target: "obs", sourceHandle: "obsOut", animated: true, style: { stroke: "oklch(0.65 0.2 85 / 0.4)" } },

  // Observation → Agent (feedback loop)
  { id: "e-obs-agent", source: "obs", target: "agent", sourceHandle: "backToAgent", targetHandle: "obsIn", animated: true, style: { stroke: "oklch(0.55 0.22 180 / 0.4)", strokeDasharray: "5 3" }, label: "🔄 palaute" },

  // Agent → Loop
  { id: "e-agent-loop", source: "agent", target: "loop", sourceHandle: "final", animated: true, style: { stroke: "oklch(0.55 0.24 280 / 0.3)", strokeDasharray: "4 2" }, label: "jos tarvitaan lisää" },

  // Loop → Action (another iteration hint)
  { id: "e-loop-action", source: "loop", target: "action", sourceHandle: "act", animated: true, style: { stroke: "oklch(0.55 0.24 280 / 0.25)", strokeDasharray: "3 3" }, label: "uusi toiminto" },

  // Loop → Final Answer
  { id: "e-loop-answer", source: "loop", target: "answer", sourceHandle: "final", animated: true, style: { stroke: "oklch(0.55 0.2 130 / 0.4)" }, label: "valmis" },
];

/**
 * AgentWorkflowDiagram — interaktiivinen React Flow -kaavio ReAct-agentin työnkulusta.
 * Näyttää Thought → Action → Observation -silmukan ja lopullisen vastauksen.
 */
export default function AgentWorkflowDiagram() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = ".react-flow__node{visibility:visible!important}";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div
      style={{
        height: "520px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid var(--glass-border)",
        background: "var(--glass-bg)",
      }}
    >
      <ReactFlow
        nodes={defaultNodes}
        edges={defaultEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={2}
      >
        <Background color="oklch(0.5 0.02 280 / 0.07)" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
