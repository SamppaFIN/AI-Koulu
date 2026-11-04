// Kysy: paikallinen aikomuksen tunnistus ilman kielimallia. Lähteet: luvut, sanasto ja insinöörien esittelyt.
import type { SiteData } from "./site";
import type { Who } from "../data/crew";
import { norm } from "./util";

type Msg = { who: Who | "me"; text: string; href?: string; label?: string };

export function start(D: SiteData, state: Record<string, unknown>) {
  const dlg = document.getElementById("ask-dialog") as HTMLDialogElement;
  const log = document.getElementById("ask-log")!, form = document.getElementById("ask-form") as HTMLFormElement;
  const input = document.getElementById("ask-q") as HTMLInputElement;
  const st = { asked: 0, last: null as null | string };
  state.ask = st;

  const add = (m: Msg) => {
    const li = document.createElement("li");
    if (m.who === "me") { li.className = "me"; li.textContent = m.text; }
    else {
      const b = document.createElement("b"); b.textContent = D.personas[m.who].name + " "; b.style.color = D.personas[m.who].color;
      li.append(b, document.createTextNode(m.text));
      if (m.href) { const a = document.createElement("a"); a.href = m.href; a.textContent = m.label ?? "Avaa"; li.append(" ", a); }
    }
    log.append(li); log.scrollTop = log.scrollHeight;
  };
  document.addEventListener("crew:line", (e) => { const d = (e as CustomEvent).detail; add({ who: d.who, text: d.text }); });

  // Hakusanat ilman ääkkösiä, koska kysymys normalisoidaan
  // Kysymyssanat eivät kerro aiheesta, joten ne ohitetaan
  const STOP = new Set(["mita", "mika", "mitka", "missa", "mista", "miten", "miksi", "kuinka", "onko", "kuka", "joka", "jossa", "tama", "sita", "luvussa", "tarkoittaa", "ovat", "oleva"]);
  const words = (s: string) => norm(s).split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !STOP.has(w));
  const stem = (w: string) => w.slice(0, Math.max(4, w.length - 2));
  const answer = (q: string): Msg[] => {
    const n = " " + norm(q) + " ", qs = words(q).map(stem);
    if (/\b(kuka|keita|kuk|insinoor|ktesib|heron|hypat)/.test(n))
      return (["ktesibios", "heron", "hypatia"] as Who[]).map((w) => ({ who: w, text: `Olen ${D.personas[w].name}, ${D.personas[w].role}.` }));
    if (/\b(mista aloit|aloita|aloitus|ensimm)/.test(n)) {
      const c = D.chapters[0];
      return [{ who: "heron", text: `Aloita luvusta ${c.n}, ${c.title}. Luvut 1–3 ovat pohja kaikelle muulle.`, href: D.base + c.path, label: "Luku " + c.n },
        { who: "hypatia", text: "Jos jokin aihe on jo tuttu, karttapainikkeesta näet kaikki luvut ja voit hypätä suoraan." }];
    }
    if (/\b(kartta|navig)/.test(n)) return [{ who: "heron", text: "Kartta on yläpalkin astrolabipainikkeen takana. Siinä ovat kaikki luvut osittain." }];
    if (/\b(piilo|nayta insin)/.test(n)) return [{ who: "ktesibios", text: "Tämän ikkunan yläreunassa on Piilota insinöörit -painike. Emme loukkaannu." }];
    // Sanasto: termi tai sen tunniste kysymyksessä
    const g = D.glossary.find((x) => n.includes(" " + norm(x.term) + " ") || n.includes(" " + x.id.replace(/-/g, " ") + " "))
      ?? D.glossary.find((x) => words(x.term).some((w) => qs.includes(stem(w))));
    // Luku: otsikon osumat painavat kaksinkertaisesti kuvaukseen ja tageihin verrattuna
    const score = (c: SiteData["chapters"][number]) => 2 * words(c.title).filter((w) => qs.includes(stem(w))).length + words(c.keys).filter((w) => qs.includes(stem(w))).length;
    const ch = D.chapters.map((c) => ({ c, s: score(c) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s)[0]?.c;
    const out: Msg[] = [];
    if (g) out.push({ who: "heron", text: `${g.term}: ${g.shortDef}`, href: `${D.base}sanasto/#${g.id}`, label: "Sanastossa" });
    if (ch) out.push({ who: "ktesibios", text: `Tästä kerrotaan luvussa ${ch.n}, ${ch.title}.`, href: D.base + ch.path, label: "Luku " + ch.n });
    if (out.length) return out;
    return [{ who: "hypatia", text: "En tunnista kysymystä, enkä halua arvata. Kokeile sivuston hakua.", href: `${D.base}haku/?q=${encodeURIComponent(q)}`, label: "Hae" }];
  };

  const ask = (q: string) => {
    const t = q.trim(); if (!t) return;
    add({ who: "me", text: t });
    for (const m of answer(t)) add(m);
    st.asked++; st.last = t;
  };
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); input.value = ""; });
  for (const b of document.querySelectorAll<HTMLButtonElement>("#ask-chips button")) b.addEventListener("click", () => ask(b.textContent!));
  document.getElementById("ask-btn")!.addEventListener("click", () => { dlg.showModal(); input.focus(); });
  dlg.addEventListener("close", () => (document.getElementById("ask-btn") as HTMLElement).focus());
}
