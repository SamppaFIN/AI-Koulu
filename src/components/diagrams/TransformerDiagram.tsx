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

/** Transformer-arkkitehtuurin visualisointi React Flow'lla */

const nodeStyles: Record<string, React.CSSProperties> = {
  input: {
    background: "oklch(0.6 0.18 240 / 0.12)",
    border: "1px solid oklch(0.6 0.18 240 / 0.3)",
    borderRadius: "10px",
    padding: "8px 14px",
    color: "var(--color-text)",
    fontSize: "0.8rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "130px",
  },
  encoder: {
    background: "oklch(0.55 0.22 180 / 0.12)",
    border: "1px solid oklch(0.55 0.22 180 / 0.3)",
    borderRadius: "10px",
    padding: "8px 14px",
    color: "var(--color-text)",
    fontSize: "0.8rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "140px",
  },
  decoder: {
    background: "oklch(0.6 0.2 150 / 0.12)",
    border: "1px solid oklch(0.6 0.2 150 / 0.3)",
    borderRadius: "10px",
    padding: "8px 14px",
    color: "var(--color-text)",
    fontSize: "0.8rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "150px",
  },
  output: {
    background: "oklch(0.55 0.24 280 / 0.12)",
    border: "1px solid oklch(0.55 0.24 280 / 0.3)",
    borderRadius: "10px",
    padding: "8px 14px",
    color: "var(--color-text)",
    fontSize: "0.8rem",
    fontWeight: 700,
    textAlign: "center",
    minWidth: "130px",
  },
  attn: {
    background: "oklch(0.65 0.2 85 / 0.12)",
    border: "1px solid oklch(0.65 0.2 85 / 0.25)",
    borderRadius: "10px",
    padding: "8px 14px",
    color: "var(--color-text)",
    fontSize: "0.8rem",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "140px",
  },
};

function InputNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.input}>
      <Handle type="source" position={Position.Bottom} style={{ background: "oklch(0.6 0.18 240 / 0.5)" }} />
      <div style={{ fontSize: "1.2rem", marginBottom: "2px" }}>📝</div>
      {data.label}
    </div>
  );
}

function EncoderNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.encoder}>
      <Handle type="target" position={Position.Top} style={{ background: "oklch(0.55 0.22 180 / 0.5)" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "oklch(0.55 0.22 180 / 0.5)" }} />
      <Handle type="source" position={Position.Right} style={{ background: "oklch(0.55 0.22 180 / 0.5)", top: "50%" }} id="cross" />
      <div style={{ fontSize: "1.2rem", marginBottom: "2px" }}>🔒</div>
      {data.label}
    </div>
  );
}

function DecoderNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.decoder}>
      <Handle type="target" position={Position.Top} style={{ background: "oklch(0.6 0.2 150 / 0.5)" }} />
      <Handle type="target" position={Position.Left} style={{ background: "oklch(0.6 0.2 150 / 0.5)", top: "50%" }} id="crossIn" />
      <Handle type="source" position={Position.Bottom} style={{ background: "oklch(0.6 0.2 150 / 0.5)" }} />
      <div style={{ fontSize: "1.2rem", marginBottom: "2px" }}>🔓</div>
      {data.label}
    </div>
  );
}

function OutputNode({ data }: NodeProps) {
  return (
    <div style={nodeStyles.output}>
      <Handle type="target" position={Position.Top} style={{ background: "oklch(0.55 0.24 280 / 0.5)" }} />
      <div style={{ fontSize: "1.2rem", marginBottom: "2px" }}>🎯</div>
      {data.label}
    </div>
  );
}

const nodeTypes = {
  input: InputNode,
  encoder: EncoderNode,
  decoder: DecoderNode,
  output: OutputNode,
};

const defaultNodes: Node[] = [
  // Input path
  { id: "inp", type: "input", position: { x: 250, y: 0 }, data: { label: "Syöte\n\"Le chat est\"" } },
  { id: "emb", type: "input", position: { x: 250, y: 85 }, data: { label: "Upotus +\nPositio-\nkoodaus" } },

  // Encoder stack (left side)
  { id: "enc1", type: "encoder", position: { x: 100, y: 190 }, data: { label: "Itse-\nhuomio\n(SA)" } },
  { id: "enc2", type: "encoder", position: { x: 100, y: 300 }, data: { label: "Feed\nForward\n(FFN)" } },
  { id: "enc3", type: "encoder", position: { x: 100, y: 410 }, data: { label: "Itse-\nhuomio\n(SA)" } },
  { id: "enc4", type: "encoder", position: { x: 100, y: 520 }, data: { label: "Feed\nForward\n(FFN)" } },

  // Decoder stack (right side)
  { id: "dec1", type: "decoder", position: { x: 400, y: 190 }, data: { label: "Maskattu\nitsehuomio" } },
  { id: "dec2", type: "decoder", position: { x: 400, y: 300 }, data: { label: "Risti-\nhuomio\n(CA)" } },
  { id: "dec3", type: "decoder", position: { x: 400, y: 410 }, data: { label: "Feed\nForward\n(FFN)" } },
  { id: "dec4", type: "decoder", position: { x: 400, y: 520 }, data: { label: "Maskattu\nitsehuomio" } },
  { id: "dec5", type: "decoder", position: { x: 400, y: 630 }, data: { label: "Risti-\nhuomio\n(CA)" } },
  { id: "dec6", type: "decoder", position: { x: 400, y: 740 }, data: { label: "Feed\nForward\n(FFN)" } },

  // Output
  { id: "out1", type: "output", position: { x: 250, y: 850 }, data: { label: "Lineaarinen\n+ Softmax" } },
  { id: "out2", type: "output", position: { x: 250, y: 940 }, data: { label: "\"The cat is\"\n⚠️ todennäköisyydet" } },
];

const defaultEdges: Edge[] = [
  // Input → Embedding → Encoder
  { id: "e-inp-emb", source: "inp", target: "emb", animated: true, style: { stroke: "oklch(0.6 0.18 240 / 0.4)" } },
  { id: "e-emb-enc1", source: "emb", target: "enc1", animated: true, style: { stroke: "oklch(0.6 0.18 240 / 0.4)" } },

  // Encoder flow
  { id: "e-enc1-enc2", source: "enc1", target: "enc2", animated: true, style: { stroke: "oklch(0.55 0.22 180 / 0.4)" } },
  { id: "e-enc2-enc3", source: "enc2", target: "enc3", animated: true, style: { stroke: "oklch(0.55 0.22 180 / 0.4)" } },
  { id: "e-enc3-enc4", source: "enc3", target: "enc4", animated: true, style: { stroke: "oklch(0.55 0.22 180 / 0.4)" } },

  // Cross-attention from last encoder to decoders
  { id: "e-enc4-dec2", source: "enc4", target: "dec2", sourceHandle: "cross", targetHandle: "crossIn", animated: true, style: { stroke: "oklch(0.65 0.2 85 / 0.35)", strokeDasharray: "6 3" } },
  { id: "e-enc4-dec5", source: "enc4", target: "dec5", sourceHandle: "cross", targetHandle: "crossIn", animated: true, style: { stroke: "oklch(0.65 0.2 85 / 0.35)", strokeDasharray: "6 3" } },

  // Decoder flow
  { id: "e-dec1-dec2", source: "dec1", target: "dec2", animated: true, style: { stroke: "oklch(0.6 0.2 150 / 0.4)" } },
  { id: "e-dec2-dec3", source: "dec2", target: "dec3", animated: true, style: { stroke: "oklch(0.6 0.2 150 / 0.4)" } },
  { id: "e-dec3-dec4", source: "dec3", target: "dec4", animated: true, style: { stroke: "oklch(0.6 0.2 150 / 0.4)" } },
  { id: "e-dec4-dec5", source: "dec4", target: "dec5", animated: true, style: { stroke: "oklch(0.6 0.2 150 / 0.4)" } },
  { id: "e-dec5-dec6", source: "dec5", target: "dec6", animated: true, style: { stroke: "oklch(0.6 0.2 150 / 0.4)" } },

  // Decoder → Output
  { id: "e-dec6-out1", source: "dec6", target: "out1", animated: true, style: { stroke: "oklch(0.55 0.24 280 / 0.4)" } },
  { id: "e-out1-out2", source: "out1", target: "out2", animated: true, style: { stroke: "oklch(0.55 0.24 280 / 0.4)" } },

  // Encoder skip to output (decoder also reads encoder output conceptually)
  { id: "e-emb-dec1", source: "emb", target: "dec1", animated: true, style: { stroke: "oklch(0.6 0.18 240 / 0.2)", strokeDasharray: "4 2" } },
];

/**
 * TransformerDiagram — interaktiivinen React Flow -kaavio Transformer-arkkitehtuurista.
 * Näyttää encoder-decoder-rakenteen, itsehuomion, ristihuomion ja output-kerroksen.
 */
export default function TransformerDiagram() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = ".react-flow__node{visibility:visible!important}";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div
      style={{
        height: "980px",
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
        fitViewOptions={{ padding: 0.1 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.4}
        maxZoom={2}
      >
        <Background color="oklch(0.5 0.02 280 / 0.07)" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
