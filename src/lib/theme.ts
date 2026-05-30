/**
 * Teemanhallinta: light / dark / system
 */

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "ai-edu-theme";

/** Hae tallennettu teema tai oletus */
export function getStoredTheme(): Theme {
  if (typeof localStorage === "undefined") return "system";
  return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
}

/** Tallenna teema ja päivitä DOM */
export function setTheme(theme: Theme): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

/** Päivitä data-theme-attribuutti */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

/** Reagoi järjestelmän teeman muutoksiin */
export function watchSystemTheme(): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    const stored = getStoredTheme();
    if (stored === "system") applyTheme("system");
  };
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}
