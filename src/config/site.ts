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
export const locales = ["en", "ru", "fr", "es", "ja"] as const;

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
  fr: "Français",
  es: "Español",
  ja: "日本語",
};

// =============================================================================
// SITE METADATA & DOMAINS
// =============================================================================

/**
 * Default site URL - used as fallback for canonical URLs, sitemaps, etc.
 * Set to your production domain.
 */
export const siteUrl = "https://example.com";

/**
 * Site name - displayed in the browser tab and meta tags.
 * Can be overridden per-locale in the `ui` object below.
 */
export const siteName = "My Site";

/**
 * Domain mapping per locale.
 * Supports multiple deployment patterns:
 *
 * - Same domain, prefixed paths:  "https://example.com"      → /ru/about
 * - Subdomain:                    "https://fr.example.com"   → /about
 * - Separate ccTLD:               "https://example.es"       → /about
 * - External domain with base:    "https://partner.com/site" → /site/about
 *
 * Leave undefined to use the default `siteUrl` for that locale.
 *
 * Note: For static builds, this affects URL generation (hreflang, canonical).
 * For SSR with domains routing, also configure `i18n.domains` in astro.config.mjs
 */
export const domains: Partial<Record<Locale, string>> = {
  // Uncomment and configure as needed:
  // en uses default siteUrl (no entry needed)
  // ru: "https://example.com",              // Same domain, prefixed path
  // fr: "https://fr.example.com",           // Subdomain
  // es: "https://example.es",               // Separate ccTLD
  // ja: "https://partner.example.com/site", // External domain with base path
};

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
  fr: {
    meta: {
      siteName: "Démo i18n",
    },
    nav: [{ label: "Accueil", path: "" }],
    ui: {
      readMore: "Lire plus",
      backToHome: "Retour à l'accueil",
    },
  },
  es: {
    meta: {
      siteName: "Demo i18n",
    },
    nav: [{ label: "Inicio", path: "" }],
    ui: {
      readMore: "Leer más",
      backToHome: "Volver al inicio",
    },
  },
  ja: {
    meta: {
      siteName: "i18nデモ",
    },
    nav: [{ label: "ホーム", path: "" }],
    ui: {
      readMore: "続きを読む",
      backToHome: "ホームに戻る",
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
