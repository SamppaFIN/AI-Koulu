// Kolme insinööriä: Path2D-hahmot koko näkymän päällä. Huomiokenttä portfolion mallin mukaan: jokainen [data-attn]-kohde
// saa huomioarvon näkymän keskikohdan, osoittimen ja näppäimistöfokuksen perusteella, ja hahmot kiertävät parasta kohdetta.
// Hiirellä ne seuraavat osoitinta, kosketuksella ja Tabilla fokusta tai näkymän keskellä olevaa kohtaa.
import type { SiteData } from "./site";
import type { Line, Who } from "../data/crew";
import { reduced } from "./util";

type Fig = { who: Who; i: number; x: number; y: number; vx: number; vy: number; lift: number; walk: number; hop: number };
type Ring = { el: Element; x0: number; y0: number; x1: number; y1: number; w: number; h: number; c: number; L: number; free: boolean };
const ORDER: Who[] = ["ktesibios", "heron", "hypatia"];
const COL = { ktesibios: "oklch(0.82 0.13 85)", heron: "oklch(0.84 0.11 200)", hypatia: "oklch(0.80 0.10 300)" };
const BG = "oklch(0.16 0.045 262)", TEXT = "oklch(0.94 0.03 85)", HOLO = "oklch(0.84 0.11 200)";
// engage: kynnys uudelle kohteelle, speak: kynnys puheelle, hold: kuinka kauan huomion pitää pysyä ennen puhetta (ms),
// release: kohde päästetään, hyst: uuden kohteen on oltava tämän verran parempi, tau*: huomion nousu ja lasku (s)
const TH = { engage: 0.35, speak: 0.55, hold: 600, release: 0.25, hyst: 0.12, tauUp: 0.35, tauDown: 1.2, arrive: 28, notice: 600, dwell: 450 };
const RING = { pad: 16, round: 24, gap: 58, v: 16, vTalk: 6, dodge: 110 };
const SPEED = [150, 170, 140];
const SLOT: [number, number][] = [[-110, 0], [-56, 0], [0, 0]]; // levossa rivissä oikeassa alakulmassa Kysy-painikkeen yläpuolella

const P = {
  flask: new Path2D("M22 19h20v5c6 4 9 10 9 18 0 12-8 21-19 21S13 54 13 42c0-8 3-14 9-18z"),
  water: new Path2D("M15 46c5 3 29 3 34 0 0 9-8 16-17 16S15 55 15 46z"),
  robe: new Path2D("M32 27c-8 0-12 22-14 46h28c-2-24-6-46-14-46z"),
};

function drawFig(ctx: CanvasRenderingContext2D, f: Fig, t: number, talking: boolean, still: boolean) {
  const c = COL[f.who], bob = still ? 0 : Math.sin(f.walk) * 1.5;
  ctx.save();
  ctx.fillStyle = "oklch(0.08 0.03 262 / 0.6)";
  ctx.beginPath(); ctx.ellipse(32, 77, 15, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.translate(0, -f.lift * 12 - f.hop + bob);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  if (f.who === "ktesibios") {
    const leg = still ? 0 : Math.sin(f.walk) * 2;
    ctx.strokeStyle = c; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(24, 63); ctx.lineTo(20 + leg, 73); ctx.moveTo(40, 63); ctx.lineTo(44 - leg, 73); ctx.stroke();
    ctx.fillStyle = BG; ctx.fill(P.flask); ctx.stroke(P.flask);
    ctx.globalAlpha = 0.55; ctx.fillStyle = HOLO; ctx.fill(P.water); ctx.globalAlpha = 1;
    if (talking && !still) for (let i = 0; i < 3; i++) { const y = 60 - ((t * 14 + i * 5) % 14); ctx.fillStyle = TEXT; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(26 + i * 5, y, 1.4, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1; ctx.fillStyle = c; ctx.fillRect(20, 12, 24, 7);
    ctx.beginPath(); ctx.moveTo(28, 12); ctx.lineTo(28, 6); ctx.stroke(); ctx.beginPath(); ctx.arc(28, 5, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = TEXT; ctx.beginPath(); ctx.arc(26, 34, 2.6, 0, Math.PI * 2); ctx.arc(38, 34, 2.6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = TEXT; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(26, 40); ctx.quadraticCurveTo(32, talking ? 47 : 44, 38, 40); ctx.stroke();
  } else if (f.who === "heron") {
    ctx.strokeStyle = c; ctx.lineWidth = 2.5;
    ctx.save(); ctx.translate(32, 22); ctx.rotate(talking && !still ? t * 2.5 : 0); ctx.translate(-32, -22);
    ctx.beginPath(); ctx.moveTo(18, 22); ctx.lineTo(11, 22); ctx.lineTo(11, 15); ctx.moveTo(46, 22); ctx.lineTo(53, 22); ctx.lineTo(53, 29); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = BG; ctx.beginPath(); ctx.arc(32, 22, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(23, 18, 18, 7, 3.5); ctx.fill();
    ctx.beginPath(); ctx.moveTo(32, 36); ctx.lineTo(32, 42); ctx.stroke();
    ctx.lineWidth = 6; ctx.setLineDash([4, 3.3]); ctx.lineDashOffset = still ? 0 : -f.walk * 2;
    ctx.beginPath(); ctx.arc(32, 57, 13, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    ctx.lineWidth = 2; ctx.fillStyle = BG; ctx.beginPath(); ctx.arc(32, 57, 9.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(32, 57, 3.5, 0, Math.PI * 2); ctx.fill();
  } else {
    const spin = still ? 0 : t * (talking ? 0.6 : 0.2);
    ctx.strokeStyle = c; ctx.lineWidth = 1.5;
    for (const [rot, a] of [[-0.28 + spin, 1], [0.38 - spin, 0.6]] as const) { ctx.globalAlpha = a; ctx.beginPath(); ctx.ellipse(32, 44, 28, 8, rot, 0, Math.PI * 2); ctx.stroke(); }
    ctx.globalAlpha = 0.22; ctx.fillStyle = c; ctx.fill(P.robe); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.stroke(P.robe);
    ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(32, 18, 9, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
    ctx.strokeStyle = TEXT; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(27.5, 18.5); ctx.quadraticCurveTo(29.5, 20, 31, 18.5); ctx.moveTo(33, 18.5); ctx.quadraticCurveTo(35, 20, 36.5, 18.5); ctx.stroke();
    ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.globalAlpha = 0.45;
    ctx.beginPath(); for (const [y, w] of [[50, 11], [57, 12], [64, 13]]) { ctx.moveTo(32 - w, y); ctx.lineTo(32 + w, y); } ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.restore();
}

export function start(D: SiteData, state: Record<string, unknown>) {
  const cv = document.getElementById("crew") as HTMLCanvasElement, ctx = cv.getContext("2d")!;
  const bubble = document.getElementById("crew-bubble")!, toggle = document.getElementById("crew-toggle")!;
  const topbar = document.querySelector<HTMLElement>(".topbar")!;
  const hero = document.querySelector<HTMLElement>(".hero-card");
  const mobile = matchMedia("(max-width: 760px)");
  let hidden = false;
  try { hidden = localStorage.getItem("ai-koulu-crew-hidden") === "1"; } catch { /* ei tallennusta */ }

  const figs: Fig[] = ORDER.map((who, i) => ({ who, i, x: NaN, y: NaN, vx: 0, vy: 0, lift: 0, walk: i * 2, hop: 0 }));
  const st = {
    mode: (hero ? "intro" : "rest") as "intro" | "rest" | "engage", focus: null as string | null, hidden,
    line: null as null | { key: string; i: number; who: Who; text: string },
    figs: [] as { who: Who; x: number; y: number; lift: number }[], orbit: false, arrived: false,
  };
  state.crew = st;

  const AV = new WeakMap<Element, number>(), IV = new WeakMap<Element, number>();
  let pointer: [number, number] | null = null, W = 0, H = 0, S = 0.78;
  let focusEl: Element | null = hero, ring: Ring | null = null, u = 0, notice = -1e9, aboveSince = 0, spoken = false;
  let cand: Element | null = null, candSince = 0, pointerMode = false;
  const trail: [number, number][] = []; // johtajan jälki uusimmasta vanhimpaan; seuraajat kulkevat sitä pitkin

  const resize = () => { const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); S = mobile.matches ? 0.6 : 0.78; };
  resize(); addEventListener("resize", resize);
  addEventListener("pointermove", (e) => { if (e.pointerType !== "touch") { pointer = [e.clientX, e.clientY]; pointerMode = true; } }, { passive: true });
  addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") { pointer = null; pointerMode = false; } }, { passive: true });
  document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) pointer = null; });
  document.addEventListener("keydown", (e) => { if (e.key === "Tab") { pointer = null; pointerMode = false; } });

  const setHidden = (h: boolean) => {
    hidden = st.hidden = h;
    document.documentElement.classList.toggle("crew-hidden", h);
    toggle.setAttribute("aria-pressed", String(h));
    toggle.textContent = h ? "Näytä insinöörit" : "Piilota insinöörit";
    try { localStorage.setItem("ai-koulu-crew-hidden", h ? "1" : "0"); } catch { /* ei tallennusta */ }
    if (!h) requestAnimationFrame(tick);
  };
  toggle.addEventListener("click", () => setHidden(!hidden));

  // Rajat: hahmot ja kehä pysyvät näkymässä yläpalkin alapuolella
  const lim = () => { const m = W < 600 ? 22 : 40; return { x0: m, x1: W - m, y0: topbar.offsetHeight + 28 + 62 * S, y1: H - 16 }; };
  const clampX = (x: number) => { const b = lim(); return Math.max(b.x0, Math.min(b.x1, x)); };
  const clampY = (y: number) => { const b = lim(); return Math.max(b.y0, Math.min(b.y1, y)); };

  // Huomioarvo: näkymän keskikohdan läheisyys, osoittimen läheisyys (220 px) ja näppäimistöfokus
  const intensity = (e: Element) => {
    if ((e as HTMLElement).checkVisibility && !(e as HTMLElement).checkVisibility()) return 0;
    const r = e.getBoundingClientRect(); if (r.bottom <= 0 || r.top >= H || !r.width) return 0;
    const top = topbar.offsetHeight, vc = (top + H) / 2, half = Math.max(1, (H - top) / 2);
    const d = vc >= r.top && vc <= r.bottom ? 0 : Math.min(Math.abs(r.top - vc), Math.abs(r.bottom - vc));
    let I = Math.max(0, 1 - d / half);
    if (pointer) { const dx = Math.max(r.left - pointer[0], 0, pointer[0] - r.right), dy = Math.max(r.top - pointer[1], 0, pointer[1] - r.bottom); I = Math.max(I * 0.8, 1 - Math.hypot(dx, dy) / 220); }
    if (document.activeElement && document.activeElement !== document.body && e.contains(document.activeElement)) I = 1;
    return I;
  };
  const ringOf = (e: Element): Ring => {
    const r = e.getBoundingClientRect(), m = RING.pad, b = lim();
    const x0 = Math.max(b.x0, r.left - m), y0 = Math.max(b.y0, r.top - m), w = Math.max(40, Math.min(b.x1, r.right + m) - x0), h = Math.max(30, Math.min(b.y1, r.bottom + m) - y0);
    const c = Math.min(RING.round, w / 2, h / 2);
    return { el: e, x0, y0, x1: x0 + w, y1: y0 + h, w, h, c, L: 2 * (w + h) - 8 * c + 2 * Math.PI * c, free: r.top - m >= b.y0 && r.bottom + m <= b.y1 };
  };
  // Kehän piste osuudesta u ∈ [0, 1) myötäpäivään yläreunan alusta
  const at = (R: Ring, uu: number): [number, number] => {
    const { x0, y0, x1, y1, c } = R, a = R.w - 2 * c, b = R.h - 2 * c, q = (Math.PI * c) / 2;
    let s = (((uu % 1) + 1) % 1) * R.L;
    const arc = (cx: number, cy: number, t0: number): [number, number] => { const t = t0 + (c ? s / c : 0); return [cx + Math.cos(t) * c, cy + Math.sin(t) * c]; };
    if (s < a) return [x0 + c + s, y0]; s -= a;
    if (s < q) return arc(x1 - c, y0 + c, -Math.PI / 2); s -= q;
    if (s < b) return [x1, y0 + c + s]; s -= b;
    if (s < q) return arc(x1 - c, y1 - c, 0); s -= q;
    if (s < a) return [x1 - c - s, y1]; s -= a;
    if (s < q) return arc(x0 + c, y1 - c, Math.PI / 2); s -= q;
    if (s < b) return [x0, y1 - c - s]; s -= b;
    return arc(x0 + c, y0 + c, Math.PI);
  };
  const nearestU = (R: Ring, x: number, y: number) => { let best = 0, bd = Infinity; for (let k = 0; k < 120; k++) { const [px, py] = at(R, k / 120), d = (px - x) ** 2 + (py - y) ** 2; if (d < bd) { bd = d; best = k / 120; } } return best; };
  const trailAt = (dist: number): [number, number] => {
    let p: [number, number] = [figs[0].x, figs[0].y];
    for (const q of trail) { const L = Math.hypot(q[0] - p[0], q[1] - p[1]); if (L >= dist) { const k = dist / L; return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; } dist -= L; p = q; }
    return p;
  };
  const shift = (dy: number) => { for (const f of figs) f.y += dy; for (const p of trail) p[1] += dy; };

  // Puhe
  let queue: Line[] = [], qKey = "", qi = -1, lineUntil = 0;
  const clearLine = () => { st.line = null; queue = []; qi = -1; bubble.classList.remove("on"); };
  const say = (key: string) => { queue = D.lines[key] ?? []; qKey = key; qi = -1; lineUntil = 0; };
  const nextLine = (now: number) => {
    qi++;
    if (qi >= queue.length) { clearLine(); if (st.mode === "intro") { st.mode = "rest"; focusEl = null; st.focus = null; endIntro(); } return; }
    const l = queue[qi];
    st.line = { key: qKey, i: qi, who: l.who, text: l.text };
    lineUntil = now + Math.max(3500, 55 * l.text.length);
    bubble.innerHTML = "";
    const b = document.createElement("b"); b.style.color = COL[l.who]; b.textContent = D.personas[l.who].name;
    if (l.re) { const re = document.createElement("span"); re.className = "re"; re.textContent = ` · vastaa: ${l.re}`; b.append(re); }
    bubble.append(b, document.createTextNode(l.text));
    bubble.classList.add("on");
    document.dispatchEvent(new CustomEvent("crew:line", { detail: { who: l.who, text: l.text } }));
  };
  const engage = (e: Element, now: number) => {
    clearLine(); focusEl = e; st.focus = (e as HTMLElement).dataset.attn ?? null; st.mode = "engage";
    spoken = false; aboveSince = 0; cand = null; st.orbit = false;
    u = nearestU(ringOf(e), figs[0].x, figs[0].y); notice = reduced() ? -1e9 : now;
  };
  const release = () => { clearLine(); focusEl = null; st.focus = null; st.mode = "rest"; spoken = false; aboveSince = 0; st.orbit = false; };
  // Esittelyn jälkeen jono muodostuu: johtajan jälki kulkee seuraajien kautta
  const endIntro = () => {
    trail.length = 0; let p: [number, number] = [figs[0].x, figs[0].y];
    for (const f of figs.slice(1)) { const n = Math.max(1, Math.round(Math.hypot(f.x - p[0], f.y - p[1]) / 4)); for (let k = 1; k <= n; k++) trail.push([p[0] + ((f.x - p[0]) * k) / n, p[1] + ((f.y - p[1]) * k) / n]); p = [f.x, f.y]; }
  };

  const goals = (now: number): [number, number][] => {
    if (st.mode === "intro" && hero) {
      const r = hero.getBoundingClientRect();
      return figs.map((f) => [r.left + 48 + f.i * 70, r.top - 12]);
    }
    if (!focusEl) { ring = null; return figs.map((f) => [W - 96 + SLOT[f.i][0] * S, H - 84]); }
    const R = ringOf(focusEl), Pr = ring;
    // Saman kohteen kehä siirtyi vierityksen takia: hahmot kulkevat sivun mukana eivätkä jää jälkeen
    if (Pr && Pr.el === focusEl && Pr.free && R.free && R.y0 !== Pr.y0 && Math.abs(R.y0 - Pr.y0) < 400) shift(R.y0 - Pr.y0);
    ring = R;
    // Uuden kohteen huomattuaan hahmot pysähtyvät hetkeksi
    if (now - notice < TH.notice) return figs.map((f) => [f.x, f.y]);
    const gu = Math.min(RING.gap / R.L, 1 / 3);
    return figs.map((f) => {
      let [x, y] = !f.i || st.orbit || reduced() ? at(R, u - f.i * gu) : trailAt(f.i * RING.gap);
      if (pointer) { const dx = x - pointer[0], dy = y - pointer[1], d = Math.hypot(dx, dy), k = RING.dodge - d; if (k > 0 && d > 0.5) { x += (dx / d) * k; y += (dy / d) * k; } }
      return [clampX(x), clampY(y)];
    });
  };

  let last = 0;
  const tick = (now: number) => {
    if (hidden) return;
    requestAnimationFrame(tick);
    if (document.hidden) { last = 0; return; }
    const dt = Math.min(0.1, (now - (last || now)) / 1000); last = now;
    const still = reduced();

    // Huomiokenttä: paras näkyvä kohde
    let best: Element | null = null, bestA = 0;
    for (const e of document.querySelectorAll("[data-attn]")) {
      const I = intensity(e), A0 = AV.get(e) ?? 0, A = A0 + (I - A0) * (1 - Math.exp(-dt / (I > A0 ? TH.tauUp : TH.tauDown)));
      AV.set(e, A); IV.set(e, I);
      if (I > 0 && (!best || A > bestA)) { best = e; bestA = A; }
    }
    if (st.mode === "intro" && hero) {
      const r = hero.getBoundingClientRect();
      if (r.bottom < topbar.offsetHeight + 60 || r.top > H - 60) { endIntro(); release(); }
    } else {
      const f = focusEl;
      if (f && (!document.contains(f) || (AV.get(f) ?? 0) < TH.release || IV.get(f) === 0)) release();
      // Uusi kohde vasta, kun se on pysynyt parhaana hetken, joten hahmot eivät lähde jokaisen ohi vieritetyn kortin perään
      const want = best && best !== focusEl && bestA >= TH.engage && (!focusEl || bestA > (AV.get(focusEl) ?? 0) + TH.hyst) ? best : null;
      if (want !== cand) { cand = want; candSince = now; }
      if (want && now - candSince >= TH.dwell * (pointerMode ? 1 : 1.6)) engage(want, now);
    }

    // Liike: johtaja kulkee matkanopeudella, seuraajat kirivät jäljessä, ja hahmot pitävät väliä toisiinsa
    const G = goals(now);
    let arrived = true;
    for (const f of figs) {
      const [gx, gy] = G[f.i], talk = st.line?.who === f.who ? 1 : 0;
      f.lift = still ? talk : f.lift + (talk - f.lift) * (1 - Math.exp(-dt / 0.18));
      const tn = now - notice - f.i * 110; f.hop = !still && tn > 0 && tn < 300 ? Math.sin((tn / 300) * Math.PI) * 6 : 0;
      if (Number.isNaN(f.x) || still) { f.x = gx; f.y = gy; continue; }
      const dx = gx - f.x, dy = gy - f.y, d = Math.hypot(dx, dy), spd = f.i ? Math.min(SPEED[f.i] * 1.6, d * 3) : Math.min(SPEED[f.i], d * 2.2), k = 1 - Math.exp(-dt / 0.3);
      let tx = d > 0.5 ? (dx / d) * spd : 0, ty = d > 0.5 ? (dy / d) * spd : 0;
      for (const o of figs) if (o !== f) { const ex = f.x - o.x, ey = f.y - o.y, e2 = ex * ex + ey * ey; if (e2 < 1600 && e2 > 0.01) { const e = Math.sqrt(e2); tx += (ex / e) * (40 - e) * 6; ty += (ey / e) * (40 - e) * 6; } }
      f.vx += (tx - f.vx) * k; f.vy += (ty - f.vy) * k;
      f.x += f.vx * dt; f.y += f.vy * dt;
      f.walk += Math.hypot(f.vx, f.vy) * dt * 0.12;
      if (d > TH.arrive) arrived = false;
    }
    st.arrived = arrived;
    if (now - notice < TH.notice) st.arrived = false;
    if (ring && !st.orbit && now - notice >= TH.notice) { const [x, y] = at(ring, u); st.orbit = Math.hypot(figs[0].x - x, figs[0].y - y) < TH.arrive; }
    const h0 = figs[0];
    if (!trail.length || Math.hypot(h0.x - trail[0][0], h0.y - trail[0][1]) > 3) { trail.unshift([h0.x, h0.y]); if (trail.length > 160) trail.pop(); }
    if (st.arrived && st.orbit && ring && !still) u += (dt * (st.line ? RING.vTalk : RING.v)) / ring.L;

    // Puhe alkaa vasta perillä ja kun huomio on pysynyt kohteessa
    if (st.mode === "intro") { if (!queue.length && qi < 0) say("welcome"); if (now > lineUntil) nextLine(now); }
    else if (focusEl) {
      if ((AV.get(focusEl) ?? 0) >= TH.speak) { if (!aboveSince) aboveSince = now; } else aboveSince = 0;
      const key = st.focus ?? "";
      if (!spoken && D.lines[key] && st.arrived && st.orbit && aboveSince && now - aboveSince >= TH.hold) { spoken = true; say(key); }
      if (queue.length && now > lineUntil) nextLine(now);
    }

    // Piirto
    ctx.clearRect(0, 0, W, H);
    for (const f of [...figs].sort((a, b) => a.lift - b.lift)) {
      const sc = S * (1 + 0.1 * f.lift);
      ctx.save(); ctx.translate(f.x - 32 * sc, f.y - 80 * sc); ctx.scale(sc, sc);
      drawFig(ctx, f, now / 1000, st.line?.who === f.who, still);
      ctx.restore();
    }
    const sp = st.line ? figs.find((f) => f.who === st.line!.who) : undefined;
    if (sp) {
      const bw = bubble.offsetWidth, bh = bubble.offsetHeight;
      let left: number, top: number;
      if (mobile.matches) { left = 8; top = H - bh - 72; } // mobiilissa kapea palkki alareunassa Kysy-painikkeen yläpuolella
      else {
        top = sp.y - 92 * S - sp.lift * 12 - bh; left = Math.max(8, Math.min(W - bw - 8, sp.x - 40));
        if (top < topbar.offsetHeight + 8) {
          const right = Math.max(...figs.map((f) => f.x)) + 40 * S;
          if (right + bw < W - 8) { left = right; top = sp.y - 70 * S - bh / 2; } else top = sp.y + 10;
        }
      }
      bubble.style.translate = `${left.toFixed(0)}px ${Math.max(topbar.offsetHeight + 8, Math.min(H - bh - 8, top)).toFixed(0)}px`;
    }
    st.figs = figs.map(({ who, x, y, lift }) => ({ who, x: Math.round(x), y: Math.round(y), lift: +lift.toFixed(2) }));
  };

  setHidden(hidden); // käynnistää piirtosilmukan, jos hahmot eivät ole piilossa
}
