/**
 * i18n Configuration
 * Single source of truth for all i18n settings
 * Used by both astro.config.mjs and application code
 */

// Supported locales
export const locales = ["en", "ru", "fr", "es", "ja"] as const;

// Default locale (content in root, no URL prefix)
export const defaultLocale = "en" as const;

// Type helpers
export type Locale = (typeof locales)[number];

// Domain mapping (per-locale origins)
// Demonstrates multiple patterns:
// - ru → same domain, prefixed paths
// - fr → subdomain
// - es → separate ccTLD
// - ja → external domain with base path
export const domains: Partial<Record<Locale, string>> = {
  en: "https://example.com",
  ru: "https://example.com",
  fr: "https://fr.example.com",
  es: "https://example.es",
  ja: "https://partner.example.com/site",
};

// Locale labels for UI
export const localeLabels: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  fr: "Français",
  es: "Español",
  ja: "日本語",
};

// Check if locale is valid
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
