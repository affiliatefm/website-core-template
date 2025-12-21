/**
 * Site Configuration
 * ==================
 * Core site settings. This file is preserved during core updates.
 *
 * Edit these values to customize your site.
 */

// Site URL (used for canonical URLs, sitemap, etc.)
export const siteUrl = "https://example.com";

// i18n settings
// Add language codes to enable multilingual support
// Example: ["en", "ru", "de"] for English, Russian, German
export const locales = ["en", "ru", "ja"] as const;
export const defaultLocale = "en";

// Global layout wrapper (applies to every page)
export const layoutPath = "./src/layouts/affiliate/Layout.astro";

// Page templates
export const templates = [
  {
    id: "article",
    path: "./src/layouts/affiliate/pages/Article.astro",
  },
  {
    id: "product",
    path: "./src/layouts/affiliate/pages/Product.astro",
  },
] as const;

// Collections
// If collection.template is not set, the first template in `templates` is used.
export const collections = [
  {
    collection: "software",
    slug: "",
    template: "product",
  },
  {
    collection: "websites",
    template: "product",
  },
] as const;
