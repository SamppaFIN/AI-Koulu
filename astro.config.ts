import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages -konfiguraatio
const site = "https://samppafin.github.io";
const base = "/AI-Koulu";

export default defineConfig({
  site,
  base,
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
