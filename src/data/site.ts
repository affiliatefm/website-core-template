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

// Template system
// - value: template folder name from src/templates (lowercase)
// - user templates should be prefixed with "_" and are preserved on update
// Available templates: affiliate
export const template = "affiliate" as const;

// Collections
// page maps collection items to a page template (home/article/product by default).
export const collections = [
  {
    collection: "software",
    slug: "",
    page: "product",
  },
  {
    collection: "websites",
    page: "product",
  },
] as const;
