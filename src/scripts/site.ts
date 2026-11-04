// Sivuston yhteinen skripti: dialogit, tekniikkamuistiinpanot, osioiden paljastus, edistyminen ja sisällysluettelo.
import type { Note } from "../data/tech";
import type { Line, Who } from "../data/crew";
import { reduced } from "./util";

export type SiteData = {
  base: string;
  tech: Record<string, Note>;
  lines: Record<string, Line[]>;
  personas: Record<Who, { name: string; role: string; color: string }>;
  chapters: { path: string; n: number; title: string; part: string; keys: string }[];
  glossary: { id: string; term: string; shortDef: string }[];
};

declare global {
  interface Window { aiKoulu: Record<string, unknown> }
}

const D: SiteData = JSON.parse(document.getElementById("site-data")!.textContent!);
const state: Record<string, unknown> = { ready: false };
window.aiKoulu = state;

// Dialogit: natiivi <dialog>, Esc sulkee, fokus palaa avaajaan
const openers = new WeakMap<HTMLDialogElement, Element | null>();
export function openDialog(dlg: HTMLDialogElement, opener?: Element | null) {
  if (dlg.open) return;
  openers.set(dlg, opener ?? document.activeElement);
  dlg.showModal();
}
for (const dlg of document.querySelectorAll<HTMLDialogElement>("dialog")) {
  dlg.addEventListener("close", () => (openers.get(dlg) as HTMLElement | null)?.focus?.());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }); // klikkaus taustaan sulkee
  for (const b of dlg.querySelectorAll("[data-close]")) b.addEventListener("click", () => dlg.close());
}

// Tekniikkamuistiinpanot
const techDlg = document.getElementById("tech-dialog") as HTMLDialogElement;
document.addEventListener("click", (e) => {
  const btn = (e.target as Element).closest<HTMLElement>("[data-tech]");
  if (!btn) return;
  const n = D.tech[btn.dataset.tech!];
  if (!n) return;
  techDlg.querySelector("#tech-title")!.textContent = n.title;
  techDlg.querySelector("#tech-technique")!.textContent = n.technique;
  techDlg.querySelector("#tech-formula")!.textContent = n.formula;
  techDlg.querySelector("#tech-why")!.textContent = n.why;
  state.tech = btn.dataset.tech;
  openDialog(techDlg, btn);
});
document.getElementById("map-btn")!.addEventListener("click", (e) => openDialog(document.getElementById("map-dialog") as HTMLDialogElement, e.currentTarget as Element));

// Osiot paljastuvat näkyviin tullessaan. Ilman skriptiä tai liikkeen vähennyksellä kaikki näkyy heti.
const secs = document.querySelectorAll<HTMLElement>(".sec");
if (secs.length && !reduced() && "IntersectionObserver" in window) {
  document.documentElement.classList.add("rv");
  const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }, { rootMargin: "0px 0px -10% 0px" });
  for (const s of secs) io.observe(s);
} else for (const s of secs) s.classList.add("in");

// Edistyminen: luku merkitään luetuksi, kun sen loppu tulee näkyviin
const KEY = "ai-koulu-progress-v2";
type Progress = { read: Record<string, string>; last?: { path: string; title: string } };
const load = (): Progress => { try { return JSON.parse(localStorage.getItem(KEY) || "") || { read: {} }; } catch { return { read: {} }; } };
const save = (p: Progress) => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* yksityinen tila */ } };
const chapterEl = document.querySelector<HTMLElement>("[data-chapter]");
if (chapterEl) {
  const path = chapterEl.dataset.chapter!, title = chapterEl.dataset.title!;
  const p = load(); p.last = { path, title }; save(p);
  const end = document.querySelector(".pager");
  if (end && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { const q = load(); q.read[path] = new Date().toISOString(); save(q); state.read = path; io.disconnect(); }
    });
    io.observe(end);
  }
}
const prog = load();
for (const card of document.querySelectorAll<HTMLElement>("[data-path]")) {
  if (prog.read[card.dataset.path!]) card.querySelector(".read")?.removeAttribute("hidden");
}
const cont = document.querySelector<HTMLAnchorElement>(".continue");
if (cont && prog.last) {
  cont.href = D.base + prog.last.path;
  cont.querySelector(".continue-title")!.textContent = prog.last.title;
  const done = Object.keys(prog.read).length;
  cont.querySelector(".continue-count")!.textContent = `Luettu ${done} / ${D.chapters.length} lukua`;
  (cont.querySelector("progress") as HTMLProgressElement).value = done;
  (cont.querySelector("progress") as HTMLProgressElement).max = D.chapters.length;
  cont.classList.add("on");
}

// Vaakasuunnassa vieritettävät taulukot ja kaavat saavat näppäimistöfokuksen, jotta niitä voi vierittää nuolinäppäimillä
const scrollables = () => { for (const el of document.querySelectorAll<HTMLElement>(".mdx table, .mdx .formula, .mdx pre")) { if (el.scrollWidth > el.clientWidth + 1) { el.tabIndex = 0; if (!el.matches("table, pre")) el.setAttribute("role", "region"); el.setAttribute("aria-label", el.getAttribute("aria-label") ?? "Vieritettävä sisältö"); } } };
// Fontin lataus muuttaa leveyksiä, joten tarkistus ajetaan myös fonttien latauduttua
scrollables(); addEventListener("resize", scrollables); document.fonts?.ready.then(scrollables);

// Kapealla näytöllä sisällysluettelo on aluksi kiinni, jotta teksti alkaa heti
const tocWrap = document.querySelector<HTMLDetailsElement>(".toc-wrap");
if (tocWrap && matchMedia("(max-width: 999px)").matches) tocWrap.open = false;

// Sisällysluettelo korostaa luettavan alaluvun
const toc = document.querySelector(".toc");
if (toc && "IntersectionObserver" in window) {
  const links = new Map([...toc.querySelectorAll<HTMLAnchorElement>("a[href^='#']")].map((a) => [a.hash.slice(1), a]));
  const io = new IntersectionObserver((es) => {
    for (const e of es) if (e.isIntersecting) { for (const a of links.values()) a.classList.remove("on"); links.get(e.target.id)?.classList.add("on"); }
  }, { rootMargin: "0px 0px -70% 0px" });
  for (const id of links.keys()) { const h = document.getElementById(id); if (h) io.observe(h); }
}

// Raskaammat osat ladataan vain sivuilla, joilla niitä on
const tasks: Promise<unknown>[] = [];
if (document.querySelector(".hero-art")) tasks.push(import("./hero").then((m) => m.start(state)));
if (document.querySelector("canvas.scape")) tasks.push(import("./scapes").then((m) => m.start(state)));
tasks.push(import("./crew").then((m) => m.start(D, state)));
tasks.push(import("./ask").then((m) => m.start(D, state)));
Promise.all(tasks).finally(() => { state.ready = true; });
