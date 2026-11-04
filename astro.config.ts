import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import redirects from "./src/data/redirects.json";

// GitHub Pages -konfiguraatio
const site = "https://samppafin.github.io";
const base = "/AI-Koulu";

export default defineConfig({
  site,
  base,
  integrations: [react(), mdx(), sitemap()],
  // Vanhat lukuosoitteet ohjautuvat uuteen lukurakenteeseen (11 → 14 lukua). Astro ei lisää base-polkua kohteeseen itse.
  redirects: Object.fromEntries(Object.entries(redirects).map(([from, to]) => [from, base + to])),
  // github-dark-default: kommenttien kontrasti riittää AA-tasoon tummalla koodipohjalla (github-dark jää 4,22:1:een)
  markdown: { shikiConfig: { theme: "github-dark-default" } },
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
