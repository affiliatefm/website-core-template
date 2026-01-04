/**
 * Content Collections Configuration
 * ==================================
 * Defines the schema for content collections.
 *
 * Content Structure:
 * - src/content/pages/           → Default language (e.g., English)
 * - src/content/pages/{lang}/    → Other languages (e.g., ru/, fr/)
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
  schema: z
    .object({
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
     * Page template type (optional).
     * Example: page: "home" | "article" | "product"
     */
    page: z.string().optional(),

    /**
     * Alternate language mappings (optional).
     * Only needed when translations have different slugs.
     * Example: alternates: { en: "about", ru: "o-nas" }
     */
    alternates: z.record(z.string(), z.string()).optional(),

    /**
     * Last updated date (optional).
     * Used in sitemap <lastmod> tag for SEO.
     * Format: YAML date (2024-12-15) or ISO string.
     */
    updatedAt: z.coerce.date().optional(),

    /**
     * Draft status (optional, default: false).
     * Draft pages are excluded from production builds.
     */
    draft: z.boolean().default(false),

    /**
     * External link (optional, used by product pages).
     */
    link: z.string().url().optional(),

    /**
     * Pros/cons (optional, used by product-style pages).
     */
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),

    /**
     * Rating table fields (optional, used by collection product pages).
     * Order is preserved as defined here.
     */
    rating: z
      .array(
        z.object({
          label: z.string(),
          value: z.union([z.string(), z.number()]),
        })
      )
      .optional(),

    /**
     * Auto-translation target (for astro-content-ai-translator).
     * Values: "all" | ["ru", "de"] | undefined
     */
    _translateTo: z.union([
      z.literal("all"),
      z.array(z.string()),
    ]).optional(),

    /**
     * AI metadata (for astro-content-ai-translator / ai tooling).
     */
    _ai: z.record(z.string(), z.unknown()).optional(),
  })
    // Allow custom frontmatter fields for user templates.
    .passthrough(),
});

export const collections = { pages };
