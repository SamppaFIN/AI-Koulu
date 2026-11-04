// Osioiden canvas-taustat. Jokainen pyörii vain näkyessään, ja liikkeen vähennyksellä piirretään yksi kuva.
import { reduced } from "./util";

type Scape = { running: boolean; frames: number };
const GOLD = "oklch(0.82 0.13 85)", MUTED = "oklch(0.80 0.035 85)";

function canvasScape(cv: HTMLCanvasElement, step: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, t: number) => void, init: (w: number, h: number) => void): Scape {
  const ctx = cv.getContext("2d")!, s: Scape = { running: false, frames: 0 };
  let w = 0, h = 0, last = 0, raf = 0;
  const size = () => { const d = Math.min(devicePixelRatio || 1, 1.5); w = cv.clientWidth; h = cv.clientHeight; cv.width = Math.round(w * d); cv.height = Math.round(h * d); ctx.setTransform(d, 0, 0, d, 0, 0); init(w, h); };
  const frame = (now: number) => { const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; step(ctx, w, h, dt, now / 1000); s.frames++; if (s.running) raf = requestAnimationFrame(frame); };
  size(); addEventListener("resize", size);
  if (reduced()) { for (let i = 0; i < 240; i++) step(ctx, w, h, 0.05, i * 0.05); return s; }
  new IntersectionObserver(([e]) => {
    s.running = e.isIntersecting;
    if (e.isIntersecting && !raf) { last = 0; raf = requestAnimationFrame(frame); }
    if (!e.isIntersecting) { cancelAnimationFrame(raf); raf = 0; }
  }).observe(cv);
  return s;
}

// Kreikkalaiset kirjaimet putoavat ja vaihtuvat matkalla tokeneiksi
function glyphs(cv: HTMLCanvasElement) {
  const G = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
  let ps: { x: number; y: number; v: number; ch: string }[] = [];
  return canvasScape(cv, (ctx, w, h, dt) => {
    ctx.clearRect(0, 0, w, h);
    ctx.font = "16px Georgia, serif";
    for (const p of ps) {
      p.y += p.v * dt;
      if (p.y > h) { p.y = -20; p.x = Math.random() * w; }
      const a = 0.35 * (1 - p.y / h);
      if (p.y < h * 0.45) { ctx.globalAlpha = a; ctx.fillStyle = GOLD; ctx.fillText(p.ch, p.x, p.y); }
      else { ctx.globalAlpha = a; ctx.fillStyle = MUTED; ctx.fillRect(p.x, p.y - 8, 7, 7); }
    }
    ctx.globalAlpha = 1;
  }, (w, h) => {
    const n = Math.round(Math.min(70, (w * h) / 14000));
    ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, v: 6 + Math.random() * 8, ch: G[Math.floor(Math.random() * G.length)] }));
  });
}

// Musteen virtaus: hiukkaset seuraavat kulmakenttää ja jättävät haalean jäljen
function flow(cv: HTMLCanvasElement) {
  let ps: { x: number; y: number }[] = [];
  const field = (x: number, y: number, t: number) => 1.6 * Math.sin(0.006 * x + 0.15 * t) + 1.6 * Math.cos(0.009 * y - 0.11 * t) + 1.2 * Math.sin(0.004 * (x + y));
  return canvasScape(cv, (ctx, w, h, _dt, t) => {
    ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,0.04)"; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over"; ctx.strokeStyle = GOLD; ctx.globalAlpha = 0.25; ctx.lineWidth = 1;
    ctx.beginPath();
    for (const p of ps) {
      const a = field(p.x, p.y, t), nx = p.x + 0.6 * Math.cos(a), ny = p.y + 0.6 * Math.sin(a);
      ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); p.x = nx; p.y = ny;
      if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) { p.x = Math.random() * w; p.y = Math.random() * h; }
    }
    ctx.stroke(); ctx.globalAlpha = 1;
  }, (w, h) => { ps = Array.from({ length: Math.round(Math.min(260, (w * h) / 3000)) }, () => ({ x: Math.random() * w, y: Math.random() * h })); });
}

export function start(state: Record<string, unknown>) {
  const out: Record<string, Scape> = {};
  for (const cv of document.querySelectorAll<HTMLCanvasElement>("canvas.scape")) {
    const kind = cv.dataset.scape!;
    if (kind === "glyphs") out.glyphs = glyphs(cv);
    if (kind === "flow") out.flow = flow(cv);
  }
  state.scapes = out;
}
