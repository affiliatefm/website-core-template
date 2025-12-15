/**
 * Content Collections Configuration
 * ==================================
 * Defines the schema for content collections.
 *
 * Content Structure:
 * - src/content/pages/           → Default locale (e.g., English)
 * - src/content/pages/{locale}/  → Other locales (e.g., ru/, fr/)
 *
 * Entry ID is derived from file path:
 * - index.mdx        → id: "index"        → URL: /
 * - about.mdx        → id: "about"        → URL: /about
 * - ru/index.mdx     → id: "ru/index"     → URL: /ru
 * - ru/about.mdx     → id: "ru/about"     → URL: /ru/about
 */

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/pages",
    /**
     * Generate ID from file path.
     * Normalizes path separators for cross-platform compatibility.
     */
    generateId: ({ entry }) =>
      entry
        .replace(/\\/g, "/") // Windows → POSIX
        .replace(/\.mdx$/, ""),
  }),
  schema: z.object({
    /**
     * Page title (required).
     * Used in <title> tag and headings.
     */
    title: z.string(),

    /**
     * Page description (optional).
     * Used in meta description tag.
     */
    description: z.string().optional(),

    /**
     * Custom URL slug (optional).
     * Overrides the default path-based URL.
     * Example: permalink: "o-nas" → /ru/o-nas instead of /ru/about
     */
    permalink: z.string().optional(),

    /**
     * Alternate language mappings (optional).
     * Only needed when translations have different slugs.
     * Example: alternates: { en: "about", ru: "o-nas" }
     */
    alternates: z.record(z.string(), z.string()).optional(),

    /**
     * Draft status (optional, default: false).
     * Draft pages are excluded from production builds.
     */
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages };
