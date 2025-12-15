/**
 * Site Configuration
 * ===================
 * This is the SINGLE SOURCE OF TRUTH for all site settings.
 * New users: Edit this file to customize your site.
 *
 * @file src/config/site.ts
 */

// =============================================================================
// LOCALES
// =============================================================================

/**
 * Supported locales for your site.
 * The first locale in this array will be used as the default.
 *
 * Add/remove locales as needed. Each locale code should match:
 * 1. A folder in src/content/pages/ (except defaultLocale)
 * 2. A key in the `ui` translations below
 */
export const locales = ["en", "ru", "ru-kz"] as const;

/**
 * Default locale - content at root level, no URL prefix.
 * Must be one of the locales defined above.
 */
export const defaultLocale = "en" as const;

/**
 * Type helper for locale strings.
 */
export type Locale = (typeof locales)[number];

/**
 * Human-readable labels for each locale.
 * Displayed in the language switcher.
 */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  "ru-kz": "Қазақстан (RU)",
};

// =============================================================================
// SITE METADATA
// =============================================================================

/**
 * Site URL - used for canonical URLs, sitemaps, hreflang tags.
 * Set to your production domain.
 */
export const siteUrl = "https://example.com";

// =============================================================================
// UI TRANSLATIONS
// =============================================================================

/**
 * UI strings for each locale.
 * Add keys as needed for your components.
 *
 * Structure:
 * - meta: Site-wide metadata
 * - nav: Navigation items (label + path pairs)
 * - ui: Common UI strings
 */
export const ui = {
  en: {
    meta: {
      siteName: "i18n Demo",
    },
    nav: [
      { label: "Home", path: "" },
      { label: "About", path: "about" },
      { label: "Docs", path: "docs/getting-started" },
      { label: "Contact", path: "contact" },
    ],
    ui: {
      readMore: "Read more",
      backToHome: "Back to home",
    },
  },
  ru: {
    meta: {
      siteName: "i18n Демо",
    },
    nav: [
      { label: "Главная", path: "" },
      { label: "О нас", path: "o-nas" },
      { label: "Документация", path: "docs/getting-started" },
    ],
    ui: {
      readMore: "Читать далее",
      backToHome: "На главную",
    },
  },
  "ru-kz": {
    meta: {
      siteName: "i18n Демо (KZ)",
    },
    nav: [
      { label: "Басты бет", path: "" },
      { label: "Біз туралы", path: "biz-turaly" },
    ],
    ui: {
      readMore: "Толығырақ оқу",
      backToHome: "Басты бетке",
    },
  },
} as const satisfies Record<Locale, UIStrings>;

/**
 * Type definition for UI strings structure.
 * Extend this interface when adding new UI sections.
 */
interface UIStrings {
  meta: {
    siteName: string;
  };
  nav: ReadonlyArray<{ label: string; path: string }>;
  ui: {
    readMore: string;
    backToHome: string;
  };
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type UIConfig = typeof ui;
export type NavItem = UIConfig[Locale]["nav"][number];
