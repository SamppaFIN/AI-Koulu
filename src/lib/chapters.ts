// Lukujen haku ja demojen tunnistus sisältökokoelmista
import { getCollection, type CollectionEntry } from "astro:content";

export type Coll = "ai-architecture" | "ui-ux";
export type Chapter = CollectionEntry<"ai-architecture"> | CollectionEntry<"ui-ux">;

// Demon nimi luvun lähdetekstistä: wrapper-komponentin nimi → näkyvä nimi
const DEMOS: Record<string, string> = {
  TokenizerDemo: "Tokenisointi", ContextDemo: "Kontekstidemo", RAGPlayground: "RAG-leikkikenttä", AgentSimulation: "Agenttisimulaatio",
  MultimodalComparison: "Multimodaalivertailu", HicksLawGame: "Hickin laki", ContrastTool: "Kontrastityökalu", CLSDemo: "CLS",
  AccessibilityLab: "Saavutettavuuslabra", SkeletonStudio: "Skeleton-näkymät",
};
export const demosOf = (c: Chapter) => Object.keys(DEMOS).filter((k) => new RegExp(`<${k}[\\s/>]`).test(c.body ?? "")).map((k) => DEMOS[k]);
export const refsOf = (c: Chapter) => [...new Set([...(c.body ?? "").matchAll(/<Reference id="([^"]+)"/g)].map((m) => m[1]))];

export async function chapters(coll: Coll, { drafts = false } = {}) {
  const all = await getCollection(coll, (e) => drafts || e.data.published);
  return all.sort((a, b) => a.data.order - b.data.order);
}
export const PARTS = ["Perusteet", "Rakennusmallit", "Agentit", "Tuotanto"];
