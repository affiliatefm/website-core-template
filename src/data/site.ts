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
// - id: template folder name from src/templates
// - style: style preset id from the selected template
// Available templates: affiliate (keep in sync with src/templates/registry.ts)
// Available styles (affiliate): paper, studio (keep in sync with src/templates/affiliate/template.ts)
export const template = {
  id: "affiliate",
  style: "light",
} as const;

// Collections
// If collection.template is not set, the first page template in the selected template is used.
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
