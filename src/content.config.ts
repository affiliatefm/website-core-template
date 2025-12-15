import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import path from "node:path";

/**
 * Pages collection - MDX pages with i18n support
 *
 * Structure:
 * - src/content/pages/          → Default locale (en)
 * - src/content/pages/ru/       → Russian locale
 *
 * Entry ID is the file path without extension:
 * - index.mdx        → id: "index"        → /
 * - about.mdx        → id: "about"        → /about
 * - ru/index.mdx     → id: "ru/index"     → /ru
 * - ru/about.mdx     → id: "ru/about"     → /ru/about
 */
const pages = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/pages",
    // Keep full path as id (don't use slug from frontmatter)
    // Normalize to POSIX separators so locale parsing works cross-platform
    generateId: ({ entry }) => path.posix.normalize(entry.replace(/\\/g, "/").replace(/\.mdx$/, "")),
  }),
  schema: z.object({
    // Required
    title: z.string(),

    // Optional meta
    description: z.string().optional(),

    // Custom URL (overrides path-based URL)
    // e.g., permalink: "o-nas" → /ru/o-nas instead of /ru/about
    permalink: z.string().optional(),

    // Alternate language versions (only for custom URL mappings)
    // e.g., alternates: { en: "about", ru: "o-nas" }
    alternates: z.record(z.string(), z.string()).optional(),

    // Draft status
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages };
