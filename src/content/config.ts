import { defineCollection, z } from "astro:content";

const aiArchitecture = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    section: z.string(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(true),
    createdAt: z.date().optional(),
  }),
});

const uiUx = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    section: z.string(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(true),
    createdAt: z.date().optional(),
  }),
});

const agentPatterns = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    section: z.string(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(true),
    createdAt: z.date().optional(),
  }),
});

export const collections = {
  "ai-architecture": aiArchitecture,
  "agent-patterns": agentPatterns,
  "ui-ux": uiUx,
};
