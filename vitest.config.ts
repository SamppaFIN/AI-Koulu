import { defineConfig } from "vitest/config";

// Vitest ajaa datatestit (*.test.ts). Playwright ajaa selaintestit (*.spec.ts).
export default defineConfig({ test: { include: ["tests/**/*.test.ts"] } });
