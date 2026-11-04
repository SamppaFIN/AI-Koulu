import { useMemo, useState } from "react";
import { CONCEPTS, LINKS, RINGS, RING_R, angleOf, polar, type Concept } from "../../data/aikakehae";

// Tekoälyn aikakehä: vuosirengas, jonka käsitteet syttyvät julkaisuvuoden mukaan.
// Kaikki tila on täällä; kehä piirretään SVG:nä, ja sama sisältö on listana näppäimistölle ja ruudunlukijalle.

type Props = { base: string; published: string[] };
const CX = 450, CY = 490, LIMB = 400;
const GOLD = "oklch(0.82 0.13 85)", HOLO = "oklch(0.84 0.11 200)", TEXT = "oklch(0.94 0.03 85)", MUTED = "oklch(0.80 0.035 85)", BG = "oklch(0.13 0.045 262)", DIM = "oklch(0.55 0.04 262)";
const f = (v: number) => v.toFixed(1);
const sorted = [...CONCEPTS].sort((a, b) => a.y - b.y);

export default function TimeDial({ base, published }: Props) {
  const [year, setYear] = useState(2026);
  const [sel, setSel] = useState("mcp");
  const pos = useMemo(() => Object.fromEntries(CONCEPTS.map((c) => [c.id, polar(CX, CY, RING_R[c.ring] + (c.dr ?? 0), angleOf(c.y))])), []);
  const lit = (c: Concept) => Math.floor(c.y) <= year;
  const cur = CONCEPTS.find((c) => c.id === sel)!;
  const idx = sorted.findIndex((c) => c.id === sel);
  const go = (k: number) => { const c = sorted[(idx + k + sorted.length) % sorted.length]; setSel(c.id); setYear(Math.floor(c.y)); };
  const pick = (c: Concept) => { setSel(c.id); setYear((y) => Math.max(y, Math.floor(c.y))); };

  const a = angleOf(year), [sx, sy] = polar(CX, CY, LIMB, -140), [ex, ey] = polar(CX, CY, LIMB, a);
  const sweep = `M ${f(sx)} ${f(sy)} A ${LIMB} ${LIMB} 0 ${a + 140 > 180 ? 1 : 0} 1 ${f(ex)} ${f(ey)}`;
  const [bx, by] = polar(CX, CY, LIMB, a + 180), [tx, ty] = polar(CX, CY, LIMB - 6, a);
  const ticks: [number, boolean][] = [];
  for (let y = 1950; y <= 2010; y += 5) ticks.push([y, y % 20 === 10 || y === 1950]);
  for (let y = 2011; y <= 2026; y++) ticks.push([y, [2015, 2020, 2022, 2024, 2026].includes(y)]);
  const [cx0, cy0] = pos[cur.id];
  const dx = cx0 - CX, dy = cy0 - CY, L = Math.hypot(dx, dy) || 1, w = cur.title.length * 9.5;
  let lx = cx0 + (dx / L) * 22, anchor: "start" | "end" = cx0 >= CX ? "start" : "end";
  if (anchor === "start" && lx + w > 890) { anchor = "end"; lx = cx0 - 14; }
  if (anchor === "end" && lx - w < 10) { anchor = "start"; lx = cx0 + 14; }
  const href = published.includes(cur.chapter) ? `${base}${cur.chapter}/` : null;
  const isNew = cur.y >= 2024;

  return (
    <div className="kehae">
      <div className="kehae-dial">
        <svg viewBox="0 0 900 1000" aria-hidden="true">
          <circle cx={CX} cy={CY} r={440} fill={BG} />
          <path d={sweep} fill="none" stroke={GOLD} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
          <circle cx={CX} cy={CY} r={LIMB} fill="none" stroke={GOLD} strokeWidth={1.2} />
          {RING_R.map((r, i) => (
            <g key={r}>
              <circle cx={CX} cy={CY} r={r} fill="none" stroke={GOLD} strokeWidth={1} opacity={0.3} />
              <text x={CX} y={CY + r - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={12} letterSpacing={1.5} fill={MUTED}>{RINGS[i].toUpperCase()}</text>
            </g>
          ))}
          {ticks.map(([y, long]) => { const [x1, y1] = polar(CX, CY, LIMB, angleOf(y)), [x2, y2] = polar(CX, CY, LIMB - (long ? 14 : 7), angleOf(y)); return <line key={y} x1={f(x1)} y1={f(y1)} x2={f(x2)} y2={f(y2)} stroke={GOLD} strokeWidth={long ? 1.6 : 0.8} />; })}
          {[1950, 1970, 1990, 2010, 2015, 2020, 2022, 2024, 2026].map((y) => { const [x, yy] = polar(CX, CY, LIMB + 26, angleOf(y)); return <text key={y} x={f(x)} y={f(yy)} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-mono)" fontSize={15} fill={TEXT}>{y}</text>; })}
          {LINKS.filter(([p, q]) => lit(CONCEPTS.find((c) => c.id === p)!) && lit(CONCEPTS.find((c) => c.id === q)!)).map(([p, q]) => (
            <line key={p + q} x1={f(pos[p][0])} y1={f(pos[p][1])} x2={f(pos[q][0])} y2={f(pos[q][1])} stroke={TEXT} strokeWidth={0.8} opacity={0.25} />
          ))}
          <line x1={f(bx)} y1={f(by)} x2={f(tx)} y2={f(ty)} stroke={TEXT} strokeWidth={1.4} opacity={0.8} />
          <circle cx={CX} cy={CY} r={7} fill={GOLD} />
          {CONCEPTS.map((c) => {
            const [x, y] = pos[c.id], on = lit(c), n = c.y >= 2024;
            return (
              <g key={c.id} className="star" onClick={() => pick(c)}>
                <circle cx={f(x)} cy={f(y)} r={15} fill="transparent" />
                {c.id === sel && <circle cx={f(x)} cy={f(y)} r={12} fill="none" stroke={TEXT} strokeWidth={1.6} />}
                {c.flag && <circle cx={f(x)} cy={f(y)} r={9} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="2 3" />}
                <circle cx={f(x)} cy={f(y)} r={5.5} fill={!on ? BG : n ? BG : GOLD} stroke={!on ? DIM : n ? HOLO : GOLD} strokeWidth={!on ? 1.2 : n ? 2 : 1} />
                {on && n && <circle cx={f(x)} cy={f(y)} r={2} fill={HOLO} />}
              </g>
            );
          })}
          <text x={f(lx)} y={f(cy0 + (dy / L) * 22)} textAnchor={anchor} dominantBaseline="middle" fontFamily="var(--font-body)" fontSize={16} fontWeight={700} fill={TEXT} stroke={BG} strokeWidth={4} paintOrder="stroke">{cur.title}</text>
        </svg>
        <ul className="kehae-legend" aria-hidden="true">
          <li><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" fill={GOLD} /></svg>Vakiintunut</li>
          <li><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" fill={BG} stroke={HOLO} strokeWidth="2" /><circle cx="8" cy="8" r="2" fill={HOLO} /></svg>Uusi, 2024–</li>
          <li><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="none" stroke={MUTED} strokeDasharray="2 3" /><circle cx="8" cy="8" r="3.5" fill={GOLD} /></svg>Vuosi tarkistetaan</li>
          <li><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" fill="none" stroke={DIM} strokeWidth="1.2" /></svg>Ei vielä valittuna vuonna</li>
        </ul>
      </div>

      <div className="kehae-side">
        <div className="kehae-control">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <label htmlFor="kehae-vuosi">Vuosi</label>
            <output htmlFor="kehae-vuosi" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2.25rem", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{year}</output>
          </div>
          <input id="kehae-vuosi" type="range" min={1950} max={2026} step={1} value={year} onChange={(e) => setYear(+e.target.value)} />
          <div className="chip-row">
            <button type="button" className="btn" style={{ flex: 1 }} onClick={() => go(-1)}>Edellinen käsite</button>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={() => go(1)}>Seuraava käsite</button>
          </div>
          <p className="muted" style={{ fontSize: "0.875rem" }}>Vuoteen {year} mennessä {CONCEPTS.filter(lit).length} / {CONCEPTS.length} käsitettä</p>
        </div>

        <section className="kehae-card" aria-live="polite" aria-labelledby="kehae-h" style={{ borderColor: isNew ? HOLO : GOLD }}>
          <p className="eyebrow" style={{ color: isNew ? HOLO : GOLD }}>{cur.date} · {RINGS[cur.ring]}</p>
          <h2 id="kehae-h" style={{ fontSize: "1.6rem" }}>{cur.title}</h2>
          <p>{cur.text}</p>
          <p className="muted" style={{ fontSize: "0.9375rem" }}>Opetetaan: {href ? <a href={href}>{cur.chapterLabel}</a> : <>{cur.chapterLabel} (tulossa)</>}</p>
          <p className="muted" style={{ fontSize: "0.9375rem" }}>Lähde: {cur.source}</p>
          {cur.flag && <p className="chip" style={{ alignSelf: "flex-start", borderStyle: "dashed" }}>Vuosi tarkistetaan ennen julkaisua</p>}
        </section>

        <details className="part" style={{ borderTop: 0 }}>
          <summary style={{ minHeight: 44 }}>Kaikki {CONCEPTS.length} käsitettä listana</summary>
          <ol style={{ margin: "0 0 12px", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 2 }}>
            {sorted.map((c) => (
              <li key={c.id}>
                <button type="button" aria-pressed={c.id === sel} onClick={() => { setSel(c.id); setYear(Math.max(year, Math.floor(c.y))); }}
                  style={{ minHeight: 36, border: 0, background: "transparent", color: "inherit", textAlign: "left", padding: 0, textDecoration: c.id === sel ? "underline" : "none" }}>
                  {c.date} · {c.title}
                </button>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </div>
  );
}
