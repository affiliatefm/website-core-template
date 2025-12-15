import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Pages collection - MDX pages with i18n support
 *
 * Structure:
 * - src/content/pages/          → Default locale (en)
 * - src/content/pages/ru/       → Russian locale
 *
 * File naming:
 * - index.mdx                   → Homepage (/)
 * - about.mdx                   → /about
 * - ru/index.mdx               → /ru
 * - ru/about.mdx               → /ru/about
 */
const pages = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/content/pages",
  }),
  schema: z.object({
    // Required
    title: z.string(),

    // Optional meta
    description: z.string().optional(),

    // Custom URL slug (overrides filename)
    // e.g., slug: "o-nas" → /ru/o-nas instead of /ru/about
    slug: z.string().optional(),

    // Alternate language versions for hreflang
    // e.g., alternates: { en: "about", ru: "o-nas" }
    alternates: z.record(z.string(), z.string()).optional(),

    // Draft status
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages };
