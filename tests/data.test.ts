import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import refs from "../src/data/references.json";
import quizzes from "../src/data/quizzes.json";
import glossary from "../src/data/glossary.json";
import { CONCEPTS, LINKS, RING_R } from "../src/data/aikakehae";
import { LINES, PERSONAS } from "../src/data/crew";
import { TECH } from "../src/data/tech";

// Datan eheys: jokainen viite, visa, termi ja repliikki osoittaa johonkin olemassa olevaan.
const CONTENT = "src/content";
const mdx = fs.readdirSync(CONTENT).flatMap((dir) =>
  fs.readdirSync(path.join(CONTENT, dir)).filter((f) => f.endsWith(".mdx")).map((f) => {
    const text = fs.readFileSync(path.join(CONTENT, dir, f), "utf8");
    return { dir, slug: f.replace(/\.mdx$/, ""), text, published: !/^published:\s*false/m.test(text) };
  }));
const ids = (re: RegExp, s: string) => [...s.matchAll(re)].map((m) => m[1]);

describe("lähdeviitteet", () => {
  const known = new Set(refs.map((r) => r.id));
  it("jokainen <Reference id> löytyy references.jsonista", () => {
    const missing = mdx.flatMap((m) => ids(/<Reference id="([^"]+)"/g, m.text).filter((id) => !known.has(id)).map((id) => `${m.slug}: ${id}`));
    expect(missing).toEqual([]);
  });
  it("viitteiden tunnisteet ovat uniikkeja ja niillä on URL", () => {
    expect(new Set(refs.map((r) => r.id)).size).toBe(refs.length);
    expect(refs.filter((r) => !/^https:\/\//.test(r.url)).map((r) => r.id)).toEqual([]);
  });
});

describe("visat", () => {
  const slugs = new Set(mdx.map((m) => m.slug));
  it("oikea vastaus osoittaa olemassa olevaan vaihtoehtoon", () => {
    expect(quizzes.filter((q) => !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length).map((q) => q.id)).toEqual([]);
  });
  it("jokainen visa kuuluu olemassa olevaan lukuun, ja tunnisteet ovat uniikkeja", () => {
    expect(quizzes.filter((q) => !slugs.has(q.chapterSlug)).map((q) => `${q.id} → ${q.chapterSlug}`)).toEqual([]);
    expect(new Set(quizzes.map((q) => q.id)).size).toBe(quizzes.length);
  });
  it("jokaisen luvun <ChapterQuiz> osoittaa luvun omaan tunnisteeseen", () => {
    const wrong = mdx.flatMap((m) => ids(/<ChapterQuiz chapterSlug="([^"]+)"/g, m.text).filter((s) => s !== m.slug).map((s) => `${m.slug}: ${s}`));
    expect(wrong).toEqual([]);
  });
});

describe("sanasto", () => {
  it("termien tunnisteet ja nimet ovat uniikkeja", () => {
    expect(new Set(glossary.map((g) => g.id)).size).toBe(glossary.length);
    expect(new Set(glossary.map((g) => g.term.toLowerCase())).size).toBe(glossary.length);
  });
  it("jokainen <TermTooltip term> löytyy sanastosta", () => {
    const known = new Set(glossary.flatMap((g) => [g.id, g.term.toLowerCase()]));
    const missing = mdx.filter((m) => m.published).flatMap((m) => ids(/<TermTooltip term="([^"]+)"/g, m.text).filter((t) => !known.has(t) && !known.has(t.toLowerCase())).map((t) => `${m.slug}: ${t}`));
    expect(missing).toEqual([]);
  });
});

describe("aikakehä", () => {
  it("käsitteet ovat uniikkeja, renkaat olemassa ja vuodet välillä 1950–2026", () => {
    expect(new Set(CONCEPTS.map((c) => c.id)).size).toBe(CONCEPTS.length);
    for (const c of CONCEPTS) { expect(RING_R[c.ring]).toBeDefined(); expect(c.y).toBeGreaterThanOrEqual(1950); expect(c.y).toBeLessThan(2027); }
  });
  it("jokainen käsite viittaa olemassa olevaan lukuun ja yhteydet olemassa oleviin käsitteisiin", () => {
    const chapters = new Set(mdx.map((m) => `${m.dir}/${m.slug}`));
    expect(CONCEPTS.filter((c) => !chapters.has(c.chapter)).map((c) => `${c.id} → ${c.chapter}`)).toEqual([]);
    const known = new Set(CONCEPTS.map((c) => c.id));
    expect(LINKS.filter(([a, b]) => !known.has(a) || !known.has(b))).toEqual([]);
  });
});

describe("insinöörit", () => {
  it("jokaisella repliikillä on tunnettu puhuja, ja vastaus viittaa toiseen hahmoon", () => {
    const names = new Set(Object.values(PERSONAS).map((p) => p.name));
    for (const [key, lines] of Object.entries(LINES)) for (const l of lines) {
      expect(PERSONAS[l.who], `${key}`).toBeDefined();
      if (l.re) { expect(names.has(l.re), `${key}: ${l.re}`).toBe(true); expect(l.re).not.toBe(PERSONAS[l.who].name); }
    }
  });
  it("jokaisessa keskustelussa (paitsi esittely) vähintään yksi repliikki vastaa toiselle", () => {
    const silent = Object.entries(LINES).filter(([k, ls]) => k !== "welcome" && !ls.some((l) => l.re)).map(([k]) => k);
    expect(silent).toEqual([]);
  });
  it("repliikki ei toista luvun tekstiä (8 sanan pätkä)", () => {
    const words = (s: string) => s.toLowerCase().replace(/[^a-zåäö0-9 ]+/g, " ").split(/\s+/).filter(Boolean);
    const grams = (s: string) => { const w = words(s); return new Set(w.slice(0, Math.max(0, w.length - 7)).map((_, i) => w.slice(i, i + 8).join(" "))); };
    const corpus = mdx.map((m) => [...grams(m.text)]).flat();
    const all = new Set(corpus);
    const hits = Object.values(LINES).flat().filter((l) => [...grams(l.text)].some((g) => all.has(g))).map((l) => l.text.slice(0, 60));
    expect(hits).toEqual([]);
  });
  it("jokainen kirjoitettu keskustelu kuuluu kohteeseen, joka on sivuilla tai on olemassa oleva luku", () => {
    const src = fs.readdirSync("src", { recursive: true }).filter((f) => /\.(astro|tsx)$/.test(String(f))).map((f) => fs.readFileSync(path.join("src", String(f)), "utf8")).join("\n");
    const targets = new Set([...ids(/data-attn="([^"{]+)"/g, src), ...mdx.map((m) => `ch:${m.dir}/${m.slug}`)]);
    expect(Object.keys(LINES).filter((k) => k !== "welcome" && !targets.has(k))).toEqual([]);
  });
});

describe("tekniikkamuistiinpanot", () => {
  it("jokainen tausta-merkintä osoittaa olemassa olevaan muistiinpanoon", () => {
    const src = fs.readdirSync("src", { recursive: true }).filter((f) => /\.astro$/.test(String(f))).map((f) => fs.readFileSync(path.join("src", String(f)), "utf8")).join("\n");
    const used = ids(/<TechTag id="([^"]+)"/g, src);
    expect(used.filter((id) => !TECH[id])).toEqual([]);
  });
});
