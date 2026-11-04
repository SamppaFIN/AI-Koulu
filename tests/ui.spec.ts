import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

// Käyttöliittymätestit portfolion mallin mukaan. Testit odottavat sivun tilaa (window.aiKoulu), eivät kiinteitä viiveitä.
type State = Record<string, any>;
const state = (page: Page) => page.evaluate(() => (window as unknown as { aiKoulu: State }).aiKoulu);
const ready = (page: Page) => page.waitForFunction(() => (window as any).aiKoulu?.ready === true);
const isMobile = (page: Page) => page.viewportSize()!.width < 760;
// React-saareke (client:visible) hydratoituu vasta näkyessään; klikkaus ennen sitä ei tee mitään
const hydrated = async (page: Page, sel: string) => {
  await page.locator(sel).first().scrollIntoViewIfNeeded();
  await page.waitForFunction((s) => { const i = document.querySelector(s)?.closest("astro-island"); return !!i && !i.hasAttribute("ssr"); }, sel);
};

test.describe("Perusta", () => {
  for (const path of ["", "ai-architecture/03-kontekstin-hallinta/", "aikakehae/", "sanasto/", "haku/"]) {
    test(`ei konsolivirheitä, ulkoisia pyyntöjä eikä vaakavieritystä: /${path}`, async ({ page }) => {
      const errors: string[] = [], external: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("request", (r) => { const u = r.url(); if (!u.startsWith("http://127.0.0.1:4329/") && !u.startsWith("data:") && !u.startsWith("blob:")) external.push(u); });
      await page.goto(path); await ready(page);
      await page.mouse.wheel(0, 4000);
      expect(errors, errors.join(" | ")).toEqual([]);
      expect(external, external.join(", ")).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    });
  }

  // Demon tunnistus luvun lähdetekstistä (src/lib/chapters.ts): merkit näkyvät AI-lukulistassa ja luvun otsikossa
  test("demojen merkit näkyvät lukulistassa ja luvun sivulla", async ({ page }) => {
    await page.goto("ai-architecture/");
    await expect(page.getByText("Demo: Tokenisointi")).toBeVisible();
    await page.goto("ui-ux/02-visual-trends/");
    await expect(page.getByText("Demo: Kontrastityökalu")).toBeVisible();
  });

  // Tekijän henkilötiedot eivät saa näkyä. Nimeä ei kirjoiteta tähän julkiseen tiedostoon: se luetaan
  // gitin ulkopuolisesta tiedostosta .private-names tai CI-salaisuudesta AIKOULU_PRIVATE_NAMES (pilkuilla erotettu).
  const privateNames = (process.env.AIKOULU_PRIVATE_NAMES ?? (fs.existsSync(".private-names") ? fs.readFileSync(".private-names", "utf8") : ""))
    .split(/[,\n]/).map((x) => x.trim().toLowerCase()).filter(Boolean);
  const PAGES = ["", "ai-architecture/", "ui-ux/", "aikakehae/", "sanasto/", "ai-architecture/03-kontekstin-hallinta/"];

  test("sivulla ei näy sähköpostiosoitetta eikä puhelinnumeroa", async ({ page }) => {
    for (const path of PAGES) {
      await page.goto(path);
      const text = await page.locator("body").innerText();
      expect(text, `sähköposti sivulla /${path}`).not.toMatch(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+[.][A-Za-z]{2,}/);
      expect(text, `puhelinnumero sivulla /${path}`).not.toMatch(/([+]358|(^|[^0-9])0)[ ]?[0-9]{2}[ -]?[0-9]{3}[ -]?[0-9]{3,4}([^0-9]|$)/);
    }
  });

  test("sivulla ei näy tekijän oikeaa nimeä", async ({ page }) => {
    test.skip(privateNames.length === 0, "Ei ajettu: tarkistettavat nimet puuttuvat (.private-names tai AIKOULU_PRIVATE_NAMES)");
    for (const path of PAGES) {
      await page.goto(path);
      const html = (await page.content()).toLowerCase();
      for (const n of privateNames) expect(html.includes(n), `kielletty nimi sivulla /${path}`).toBe(false);
    }
  });

  test("vanha lukuosoite ohjautuu uuteen", async ({ page }) => {
    await page.goto("ai-architecture/02-2-rag/");
    await page.waitForURL(/\/AI-Koulu\/ai-architecture\/05-rag\/$/);
    await expect(page.locator("h1")).toHaveText("RAG");
  });
});

test.describe("Hero ja taustat", () => {
  test("hero piirtää näkyvissä ja pysähtyy, kun sitä ei näy; ilman WebGL:ää SVG jää", async ({ page }) => {
    await page.goto(""); await ready(page);
    await expect(page.locator(".hero-art svg")).toBeVisible();
    const s = await state(page);
    if (!s.hero.webgl) return; // varakuva: pelkkä SVG
    await page.waitForFunction(() => (window as any).aiKoulu.hero.frames > 2);
    await page.locator("#uiux").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => (window as any).aiKoulu.hero.running === false);
  });

  test("osioiden taustat pyörivät vain näkyessään", async ({ page }) => {
    await page.goto(""); await ready(page);
    await page.locator("#sanasto").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => (window as any).aiKoulu.scapes.flow.running === true);
    await page.locator(".hero").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => (window as any).aiKoulu.scapes.flow.running === false);
  });

  test("prefers-reduced-motion: hero ja taustat paikallaan, osiot näkyvät heti", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" }), page = await ctx.newPage();
    await page.goto("http://127.0.0.1:4329/AI-Koulu/"); await ready(page);
    expect(await page.evaluate(() => document.documentElement.classList.contains("rv"))).toBe(false);
    const a = await state(page);
    await page.mouse.wheel(0, 3000);
    await page.waitForFunction(() => document.querySelectorAll(".sec.in").length === document.querySelectorAll(".sec").length);
    const b = await state(page);
    if (a.hero.webgl) expect(b.hero.frames).toBe(a.hero.frames);
    expect(b.scapes.glyphs.running).toBe(false);
    await ctx.close();
  });
});

test.describe("Dialogit ja näppäimistö", () => {
  test("tausta-merkintä avaa tekniikkadialogin, Esc sulkee ja fokus palaa avaajaan", async ({ page }) => {
    await page.goto(""); await ready(page);
    const tag = page.locator('[data-tech="hero"]');
    await tag.focus(); await page.keyboard.press("Enter");
    await expect(page.locator("#tech-dialog")).toBeVisible();
    await expect(page.locator("#tech-title")).toHaveText("Astrolabi-hero");
    await expect(page.locator("#tech-formula")).not.toBeEmpty();
    await page.keyboard.press("Escape");
    await expect(page.locator("#tech-dialog")).toBeHidden();
    await expect(tag).toBeFocused();
  });

  test("kartta listaa luvut, ja Tab kulkee skip-linkistä sisältöön", async ({ page }) => {
    await page.goto(""); await ready(page);
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();
    await page.locator("#map-btn").click();
    await expect(page.locator("#map-dialog .map-list a").first()).toBeVisible();
    expect(await page.locator("#map-dialog .map-list a").count()).toBeGreaterThanOrEqual(19);
    await page.keyboard.press("Escape");
    await expect(page.locator("#map-btn")).toBeFocused();
  });

  test("kosketuskohteet ovat vähintään 44 px korkeita", async ({ page }) => {
    await page.goto(""); await ready(page);
    const small = await page.$$eval(".topbar a, .topbar button, .btn, .ask-fab", (els) => els.filter((e) => (e as HTMLElement).offsetParent && e.getBoundingClientRect().height < 43.5).map((e) => e.outerHTML.slice(0, 80)));
    expect(small).toEqual([]);
  });
});

test.describe("Insinöörit ja Kysy", () => {
  test("esittely: jokainen esittäytyy vuorollaan, puhuja nousee", async ({ page }) => {
    await page.goto(""); await ready(page);
    for (const who of ["ktesibios", "heron", "hypatia"]) {
      await page.waitForFunction((w) => { const c = (window as any).aiKoulu.crew; return c.line?.key === "welcome" && c.line.who === w; }, who, { timeout: 20_000 });
      await page.waitForFunction((w) => (window as any).aiKoulu.crew.figs.find((f: any) => f.who === w).lift > 0.8, who);
    }
  });

  test("osoitettu kohde: hahmot siirtyvät sen kehälle ja puhuvat vasta perillä", async ({ page }) => {
    test.skip(isMobile(page), "Mobiilissa kohde valitaan vierityksestä");
    await page.goto("ai-architecture/03-kontekstin-hallinta/"); await ready(page);
    const demo = page.locator('[data-attn="demo:konteksti"]');
    await demo.scrollIntoViewIfNeeded();
    const box = (await demo.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForFunction(() => (window as any).aiKoulu.crew.focus === "demo:konteksti");
    await page.waitForFunction(() => (window as any).aiKoulu.crew.line?.key === "demo:konteksti", null, { timeout: 15_000 });
    const s = await state(page), lead = s.crew.figs[0];
    const r = (await demo.boundingBox())!;
    // Johtaja on kohteen kehällä: enintään 40 px laatikon ulkopuolella
    expect(lead.x).toBeGreaterThan(r.x - 40); expect(lead.x).toBeLessThan(r.x + r.width + 40);
    expect(lead.y).toBeGreaterThan(r.y - 40); expect(lead.y).toBeLessThan(r.y + r.height + 40);
  });

  test("mobiili: näkymän keskellä oleva kohde saa repliikit vierityksen mukana", async ({ page }) => {
    test.skip(!isMobile(page), "Vain mobiili");
    await page.goto("ai-architecture/03-kontekstin-hallinta/"); await ready(page);
    await page.locator('[data-attn="demo:konteksti"]').evaluate((e) => e.scrollIntoView({ block: "center" }));
    await page.waitForFunction(() => (window as any).aiKoulu.crew.line?.key === "demo:konteksti", null, { timeout: 15_000 });
  });

  test("Kysy vastaa paikallisesti, tuntematon kysymys saa rehellisen vastauksen, piilotus tallentuu", async ({ page }) => {
    await page.goto(""); await ready(page);
    await page.locator("#ask-btn").click();
    await page.locator("#ask-chips button", { hasText: "kompaktointi" }).click();
    await expect(page.locator("#ask-log li").last()).toContainText("Kontekstin hallinta");
    await page.locator("#ask-q").fill("kuinka monta kuuta Jupiterilla on");
    await page.locator("#ask-q").press("Enter");
    await expect(page.locator("#ask-log li").last()).toContainText("En tunnista kysymystä");
    await page.locator("#crew-toggle").click();
    await expect(page.locator("#crew-toggle")).toHaveAttribute("aria-pressed", "true");
    await page.reload(); await ready(page);
    expect((await state(page)).crew.hidden).toBe(true);
    await expect(page.locator("#crew")).toBeHidden();
  });
});

test.describe("Aikakehä ja demot", () => {
  test("vuosiliukusäädin sytyttää käsitteet ja seuraava käsite etenee järjestyksessä", async ({ page }) => {
    await page.goto("aikakehae/");
    await hydrated(page, "#kehae-vuosi");
    const slider = page.locator("#kehae-vuosi");
    await slider.fill("2017");
    await expect(page.getByText(/Vuoteen 2017 mennessä \d+ \/ 28 käsitettä/)).toBeVisible();
    await page.getByRole("button", { name: "Seuraava käsite" }).click();
    await expect(page.locator("#kehae-h")).toHaveText("Koodausagentit");
    await expect(page.locator("output[for=kehae-vuosi]")).toHaveText("2025");
  });

  test("Kontekstidemo: vuoro kasvattaa syötettä, kehotteen muutos nollaa välimuistin", async ({ page }) => {
    await page.goto("ai-architecture/03-kontekstin-hallinta/");
    await hydrated(page, ".demo");
    const status = page.locator(".demo [role=status]");
    await expect(status).toContainText("Syöte 50 % ikkunasta");
    await page.getByRole("button", { name: "Lisää keskusteluvuoro" }).click();
    await expect(status).toContainText("Syöte 58 % ikkunasta");
    await page.getByRole("button", { name: "Muuta järjestelmäkehotetta" }).click();
    await expect(status).toContainText("josta välimuistista 0 %");
    await page.getByRole("button", { name: "Kompaktoi historia" }).click();
    await expect(status).toContainText("josta välimuistista 22 %");
  });

  test("luku merkitään luetuksi, ja etusivu tarjoaa jatkamista", async ({ page }) => {
    await page.goto("ai-architecture/03-kontekstin-hallinta/"); await ready(page);
    await page.locator(".pager").scrollIntoViewIfNeeded();
    await page.waitForFunction(() => (window as any).aiKoulu.read === "ai-architecture/03-kontekstin-hallinta/");
    await page.goto(""); await ready(page);
    await expect(page.locator(".continue")).toBeVisible();
    await expect(page.locator(".continue-title")).toHaveText("Luku 3 · Kontekstin hallinta");
    await expect(page.locator('[data-path="ai-architecture/03-kontekstin-hallinta/"] .read')).toBeVisible();
  });
});
