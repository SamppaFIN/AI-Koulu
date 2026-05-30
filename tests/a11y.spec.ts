import { test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

// Hae kaikki HTML-tiedostot dist-kansiosta
function getAllPages(): string[] {
  const pages: string[] = [];
  function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith(".html")) {
        pages.push(path.relative(distDir, fullPath).replace(/\\/g, "/"));
      }
    }
  }
  walk(distDir);
  return pages;
}

const pages = getAllPages();

test.describe("Accessibility checks", () => {
  for (const pagePath of pages) {
    test(`${pagePath} should have no critical a11y violations`, async ({ page }) => {
      const url = `file://${path.join(distDir, pagePath)}`;
      await page.goto(url, { waitUntil: "networkidle" });

      const results = await new AxeBuilder({ page }).analyze();

      // Vain kriittiset ja vakavat virheet estävät testin
      const criticalViolations = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (criticalViolations.length > 0) {
        console.log(`\n❌ ${pagePath}: ${criticalViolations.length} kriittistä/vakavaa ongelmaa`);
        for (const v of criticalViolations) {
          console.log(`  - ${v.id}: ${v.help}`);
          console.log(`    Tags: ${v.tags.join(", ")}`);
        }
      }

      expect(criticalViolations.length).toBe(0);
    });
  }
});
