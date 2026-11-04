import { defineConfig, devices } from "@playwright/test";

// Testit ajetaan valmista buildia vasten preview-palvelimella, jotta base-polku /AI-Koulu/ ja tyylit latautuvat kuten tuotannossa.
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts", // Vitest ajaa tiedostot *.test.ts
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: "http://127.0.0.1:4329/AI-Koulu/",
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4329",
    url: "http://127.0.0.1:4329/AI-Koulu/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
  ],
});
