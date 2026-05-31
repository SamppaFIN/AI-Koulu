"use client";

import { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type ReactFlowInstance,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/** RAG-putken visualisointi React Flow'lla */

const nodeStyles: Record<string, React.CSSProperties> = {
  data: {
    background: "oklch(0.6 0.18 240 / 0.15)",
    border: "1px solid oklch(0.6 0.18 240 / 0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "var(--color-text)",
    fontSize: "0.85rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "120px",
  },
  process: {
    background: "oklch(0.6 0.2 150 / 0.15)",
    border: "1px solid oklch(0.6 0.2 150 / 0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "var(--color-text)",
    fontSize: "0.85rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "120px",
  },
  storage: {
    background: "oklch(0.65 0.2 85 / 0.15)",
    border: "1px solid oklch(0.65 0.2 85 / 0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "var(--color-text)",
    fontSize: "0.85rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "120px",
  },
  llm: {
    background: "oklch(0.55 0.24 280 / 0.15)",
    border: "1px solid oklch(0.55 0.24 280 / 0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    color: "var(--color-text)",
    fontSize: "0.85rem",
    fontWeight: 700,
    textAlign: "center",
    minWidth: "120px",
  },
};

function DataNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.data}>
      <Handle type="source" position={Position.Bottom} style={{ background: "oklch(0.6 0.18 240 / 0.5)" }} />
      <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>📄</div>
      {data.label}
    </div>
  );
}

function ProcessNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.process}>
      <Handle type="target" position={Position.Top} style={{ background: "oklch(0.6 0.2 150 / 0.5)" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "oklch(0.6 0.2 150 / 0.5)" }} />
      <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>⚙️</div>
      {data.label}
    </div>
  );
}

function StorageNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.storage}>
      <Handle type="target" position={Position.Top} style={{ background: "oklch(0.65 0.2 85 / 0.5)" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "oklch(0.65 0.2 85 / 0.5)" }} />
      <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>🗄️</div>
      {data.label}
    </div>
  );
}

function LLMNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.llm}>
      <Handle type="target" position={Position.Top} style={{ background: "oklch(0.55 0.24 280 / 0.5)" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "oklch(0.55 0.24 280 / 0.5)" }} />
      <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>🧠</div>
      {data.label}
    </div>
  );
}

const nodeTypes = {
  data: DataNode,
  process: ProcessNode,
  storage: StorageNode,
  llm: LLMNode,
};

const defaultNodes: Node[] = [
  { id: "1", type: "data", position: { x: 200, y: 0 }, data: { label: "Dokumentit" } },
  { id: "2", type: "process", position: { x: 200, y: 80 }, data: { label: "Chunkkaus" } },
  { id: "3", type: "process", position: { x: 200, y: 160 }, data: { label: "Upotus\n(embedding)" } },
  { id: "4", type: "storage", position: { x: 200, y: 260 }, data: { label: "Vektori-\ntietokanta" } },
  { id: "5", type: "process", position: { x: 200, y: 360 }, data: { label: "Kyselyn upotus\n+ haku" } },
  { id: "6", type: "process", position: { x: 200, y: 450 }, data: { label: "Kontekstin\nmuodostus" } },
  { id: "7", type: "llm", position: { x: 200, y: 540 }, data: { label: "LLM generoi\nvastauksen" } },
];

const defaultEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "oklch(0.6 0.18 240 / 0.4)" } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "oklch(0.6 0.18 240 / 0.4)" } },
  { id: "e3-4", source: "3", target: "4", animated: true, style: { stroke: "oklch(0.6 0.18 240 / 0.4)" } },
  { id: "e5-4", source: "5", target: "4", animated: true, style: { stroke: "oklch(0.65 0.2 85 / 0.4)" }, label: "haku" },
  { id: "e4-5", source: "4", target: "5", animated: true, style: { stroke: "oklch(0.65 0.2 85 / 0.4)" }, label: "tulokset" },
  { id: "e5-6", source: "5", target: "6", animated: true, style: { stroke: "oklch(0.6 0.2 150 / 0.4)" } },
  { id: "e6-7", source: "6", target: "7", animated: true, style: { stroke: "oklch(0.55 0.24 280 / 0.4)" } },
];

/**
 * RAGDiagram — interaktiivinen React Flow -kaavio RAG-putkesta.
 */
export default function RAGDiagram() {
  const rfInstance = useRef<ReactFlowInstance | null>(null);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    rfInstance.current = instance;
    // Viiveellä fitView, jotta kontin dimensiot varmasti saatavilla
    setTimeout(() => {
      instance.fitView({ padding: 0.15, duration: 300 });
    }, 200);
  }, []);

  return (
    <div
      style={{
        height: "620px",
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
        onInit={onInit}
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background color="oklch(0.5 0.02 280 / 0.08)" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
