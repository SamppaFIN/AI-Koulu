import { useState } from "react";

// Kontekstidemo: yhden mallikutsun syöte palasina. Näyttää, miten historia kasvattaa syötettä,
// mitä kompaktointi tekee ja mikä osa etuliitteestä voidaan lukea välimuistista.
// Osuudet ovat havainnollistus, eivät mittaus.

const SYS = 10, TOOLS = 12, TURN = 8, SUM = 6, MSG = 4;
const GOLD = "oklch(0.82 0.13 85)", GOLD2 = "oklch(0.88 0.08 85)", MUTED = "oklch(0.80 0.035 85)", VIOLET = "oklch(0.80 0.10 300)", HOLO = "oklch(0.84 0.11 200)";

type Seg = { key: string; label: string; short: string; w: number; c: string; cached: boolean };

export default function ContextDemo() {
  const [turns, setTurns] = useState(3);
  const [summary, setSummary] = useState(false);
  const [cache, setCache] = useState(true);
  const [event, setEvent] = useState<"none" | "compacted" | "prefix">("none");

  const used = SYS + TOOLS + (summary ? SUM : 0) + turns * TURN + MSG;
  const full = used + TURN > 100;
  // Välimuistiin osuu se etuliite, joka on sama kuin edellisessä kutsussa
  const hit = (i: number) => {
    if (!cache || event === "prefix") return false;
    if (event === "compacted") return i < 2;
    return i < 2 + (summary ? 1 : 0) + Math.max(0, turns - 1);
  };
  const raw: Omit<Seg, "cached">[] = [
    { key: "sys", label: "Järjestelmäkehote", short: "Ohje", w: SYS, c: GOLD },
    { key: "tools", label: "Työkalujen kuvaukset", short: "Työkalut", w: TOOLS, c: GOLD2 },
    ...(summary ? [{ key: "sum", label: "Tiivistelmä vanhasta historiasta", short: "Tiiv.", w: SUM, c: VIOLET }] : []),
    ...Array.from({ length: turns }, (_, i) => ({ key: `t${i}`, label: `Vuoro ${i + 1}`, short: String(i + 1), w: TURN, c: MUTED })),
    { key: "msg", label: "Uusi viesti", short: "", w: MSG, c: HOLO },
  ];
  const segs: Seg[] = raw.map((s, i) => ({ ...s, cached: hit(i) }));
  const cached = segs.filter((s) => s.cached).reduce((a, s) => a + s.w, 0);

  const status = full ? "Ikkuna on täynnä. Kompaktoi historia tai aloita uusi keskustelu."
    : event === "prefix" ? "Järjestelmäkehote muuttui, joten etuliite eroaa heti alusta. Välimuisti ei osu mihinkään."
    : event === "compacted" ? "Historia korvattiin tiivistelmällä. Vain järjestelmäkehote ja työkalut ovat ennallaan ja osuvat välimuistiin."
    : !cache ? "Välimuisti on pois, joten koko syöte käsitellään joka kutsulla."
    : used > 80 ? "Ikkuna täyttyy. Kompaktointi kannattaa pian." : "Edellisen kutsun etuliite luetaan välimuistista. Vain uusin vuoro ja uusi viesti käsitellään.";

  const btn = { minHeight: 44 } as const;
  return (
    <div className="demo" aria-labelledby="ctx-h">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <h3 id="ctx-h">Kontekstidemo</h3>
        <p className="demo-note">Osuudet ovat havainnollistus, eivät mittaus</p>
      </div>
      <div aria-hidden="true" style={{ marginTop: 12, height: 64, borderRadius: 10, border: "2px solid var(--text)", background: "var(--bg-deep)", display: "flex", gap: 2, padding: 4, overflow: "hidden" }}>
        {segs.map((s) => (
          <div key={s.key} style={{ flex: `0 0 ${s.w}%`, borderRadius: 6, background: s.c, outline: s.cached ? "2px dashed var(--on-gold)" : "none", outlineOffset: -5,
            color: "var(--on-gold)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>{s.short}</div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)", marginTop: 4 }}><span>0 %</span><span>ikkunan raja 100 %</span></div>
      <p role="status" style={{ marginTop: 12 }}><strong>Syöte {used} % ikkunasta, josta välimuistista {cached} %.</strong> {status}</p>
      <ul style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "flex", flexDirection: "column", gap: 4, fontSize: 15 }}>
        {[...segs.filter((s) => !s.key.startsWith("t")), ...(turns ? [{ key: "hist", label: `Keskusteluhistoria, ${turns} ${turns === 1 ? "vuoro" : "vuoroa"}`, w: turns * TURN, c: MUTED, cached: segs.some((s) => s.key.startsWith("t") && s.cached), short: "" }] : [])].map((s) => (
          <li key={s.key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span aria-hidden="true" style={{ flex: "none", width: 16, height: 16, borderRadius: 4, background: s.c, outline: s.cached ? "2px dashed var(--text)" : "none", outlineOffset: 2 }} />
            <span>{s.label} · {s.w} %{s.cached ? " · välimuistista" : ""}</span>
          </li>
        ))}
      </ul>
      <div className="chip-row" style={{ marginTop: 14 }}>
        <button type="button" className="btn btn-primary" style={btn} aria-disabled={full} onClick={() => { if (!full) { setTurns(turns + 1); setEvent("none"); } }}>Lisää keskusteluvuoro</button>
        <button type="button" className="btn" style={btn} onClick={() => { if (turns > 1) { setSummary(true); setTurns(1); setEvent("compacted"); } }}>Kompaktoi historia</button>
        <button type="button" className="btn" style={btn} onClick={() => setEvent("prefix")}>Muuta järjestelmäkehotetta</button>
        <button type="button" className="btn" style={btn} aria-pressed={cache} onClick={() => setCache(!cache)}>Välimuisti: {cache ? "päällä" : "pois"}</button>
        <button type="button" className="btn" style={{ ...btn, borderColor: "transparent" }} onClick={() => { setTurns(3); setSummary(false); setCache(true); setEvent("none"); }}>Aloita alusta</button>
      </div>
    </div>
  );
}
