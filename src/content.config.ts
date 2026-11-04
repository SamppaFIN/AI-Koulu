import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const chapter = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number(),
  section: z.string(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(true),
  createdAt: z.date().optional(),
});

export const collections = {
  "ai-architecture": defineCollection({ loader: glob({ pattern: "**/*.mdx", base: "./src/content/ai-architecture" }), schema: chapter }),
  "ui-ux": defineCollection({ loader: glob({ pattern: "**/*.mdx", base: "./src/content/ui-ux" }), schema: chapter }),
};
