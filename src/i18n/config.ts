/**
 * i18n Configuration
 * Single source of truth for all i18n settings
 * Used by both astro.config.mjs and application code
 */

// Supported locales
export const locales = ["en", "ru"] as const;

// Default locale (content in root, no URL prefix)
export const defaultLocale = "en" as const;

// Type helpers
export type Locale = (typeof locales)[number];

// Locale labels for UI
export const localeLabels: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
};

// Check if locale is valid
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
