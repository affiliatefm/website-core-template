/**
 * i18n Utility Functions
 * =======================
 * Helper functions for internationalization.
 * Uses Astro's built-in i18n features where possible.
 */

import { getRelativeLocaleUrl } from "astro:i18n";
import {
  locales,
  defaultLocale,
  siteUrl,
  ui,
  type Locale,
} from "@/config/site";

// =============================================================================
// LOCALE VALIDATION & NORMALIZATION
// =============================================================================

/**
 * Check if a string is a valid locale.
 */
export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

/**
 * Convert locale code to BCP 47 format for hreflang tags.
 *
 * Path/folder names can be any format (e.g., "ru-kz", "kz", "zh-hans"),
 * but hreflang tags must follow BCP 47 standard:
 * - Language subtag: lowercase (e.g., "en", "ru")
 * - Region subtag: UPPERCASE (e.g., "US", "KZ")
 * - Script subtag: Title case (e.g., "Hans", "Latn")
 *
 * Examples:
 * - "en" → "en"
 * - "ru-kz" → "ru-KZ"
 * - "zh-hans" → "zh-Hans"
 * - "pt-br" → "pt-BR"
 */
export function toHreflang(locale: string): string {
  const parts = locale.split("-");

  if (parts.length === 1) {
    // Simple language code: "en", "ru"
    return parts[0].toLowerCase();
  }

  if (parts.length === 2) {
    const [first, second] = parts;

    // Check if second part is a script (4 letters) or region (2 letters)
    if (second.length === 4) {
      // Script: zh-hans → zh-Hans
      return `${first.toLowerCase()}-${second.charAt(0).toUpperCase()}${second.slice(1).toLowerCase()}`;
    }

    // Region: ru-kz → ru-KZ
    return `${first.toLowerCase()}-${second.toUpperCase()}`;
  }

  // Three parts: language-script-region (e.g., zh-Hans-CN)
  if (parts.length === 3) {
    const [lang, script, region] = parts;
    return `${lang.toLowerCase()}-${script.charAt(0).toUpperCase()}${script.slice(1).toLowerCase()}-${region.toUpperCase()}`;
  }

  // Fallback: return as-is
  return locale;
}

// =============================================================================
// TRANSLATIONS
// =============================================================================

/**
 * Get UI translations for a locale.
 * Falls back to default locale if translation is missing.
 */
export function t(locale: Locale) {
  return ui[locale] ?? ui[defaultLocale];
}

// =============================================================================
// CONTENT COLLECTION HELPERS
// =============================================================================

/**
 * Extract locale from content entry ID.
 *
 * Entry IDs follow the pattern:
 * - "index" → defaultLocale
 * - "about" → defaultLocale
 * - "docs/getting-started" → defaultLocale
 * - "ru/index" → "ru"
 * - "ru/about" → "ru"
 * - "ru/docs/getting-started" → "ru"
 */
export function getLocaleFromId(id: string): Locale {
  const firstSegment = id.split("/")[0];
  return isValidLocale(firstSegment) ? firstSegment : defaultLocale;
}

/**
 * Get the base path from entry ID (path without locale prefix).
 * Used for matching translations across locales.
 *
 * Examples:
 * - "index" → ""
 * - "about" → "about"
 * - "docs/index" → "docs"
 * - "docs/getting-started" → "docs/getting-started"
 * - "ru/index" → ""
 * - "ru/about" → "about"
 * - "ru/docs/index" → "docs"
 * - "ru/docs/getting-started" → "docs/getting-started"
 */
export function getBasePath(id: string): string {
  const locale = getLocaleFromId(id);

  let path = id;

  // Remove locale prefix for non-default locales
  if (locale !== defaultLocale) {
    path = path.replace(new RegExp(`^${locale}/`), "");
  }

  // Handle index files:
  // - "index" → "" (root homepage)
  // - "docs/index" → "docs" (section index)
  if (path === "index") {
    return "";
  }
  return path.replace(/\/index$/, "");
}

/**
 * Get URL slug for an entry.
 * Uses permalink from frontmatter if provided, otherwise derives from path.
 */
export function getUrlSlug(entry: {
  id: string;
  data: { permalink?: string };
}): string {
  if (entry.data.permalink?.trim()) {
    return entry.data.permalink.replace(/^\//, "");
  }
  return getBasePath(entry.id);
}

/**
 * Build full URL path for a page entry.
 */
export function getPageUrl(entry: {
  id: string;
  data: { permalink?: string };
}): string {
  const locale = getLocaleFromId(entry.id);
  const slug = getUrlSlug(entry);
  return getRelativeLocaleUrl(locale, slug);
}

// =============================================================================
// URL HELPERS
// =============================================================================

/**
 * Get site origin (without trailing slash).
 */
function getOrigin(): string {
  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
}

/**
 * Build absolute URL for a locale.
 * Combines siteUrl with Astro's relative locale URL.
 */
export function getAbsoluteLocaleUrl(locale: Locale, slug: string): string {
  const relative = getRelativeLocaleUrl(locale, slug);
  return `${getOrigin()}${relative}`;
}

// =============================================================================
// ALTERNATE URLS (HREFLANG)
// =============================================================================

type PageEntry = {
  id: string;
  data: {
    permalink?: string;
    alternates?: Record<string, string>;
  };
};

/**
 * Check if a string is a full URL (external link).
 */
function isFullUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

/**
 * Get alternate language URLs for a page.
 * Used for hreflang tags and language switcher.
 *
 * Resolution logic:
 * 1. Explicit `alternates` in frontmatter:
 *    - Full URL (https://...) → used as-is (external site)
 *    - Slug → resolved to local page (throws if not found)
 * 2. Auto-find pages with matching base path in other locales
 *
 * When `absolute: true`, local URLs include domain for SEO tags.
 *
 * @throws Error if alternates references non-existent page or invalid locale
 */
export function getAlternateUrls(
  entry: PageEntry,
  allEntries: PageEntry[],
  options?: { absolute?: boolean }
): Record<string, string> {
  const result: Record<string, string> = {};
  const currentLocale = getLocaleFromId(entry.id);
  const currentSlug = getUrlSlug(entry);

  // Helper to build URL for local pages
  const buildLocalUrl = (locale: Locale, slug: string): string => {
    if (options?.absolute) {
      return getAbsoluteLocaleUrl(locale, slug);
    }
    return getRelativeLocaleUrl(locale, slug);
  };

  // Always include current page
  result[currentLocale] = buildLocalUrl(currentLocale, currentSlug);

  // Process explicit alternates from frontmatter
  if (entry.data.alternates) {
    for (const [key, value] of Object.entries(entry.data.alternates)) {
      if (key === currentLocale) continue;

      // Full URL = external site, use as-is
      if (isFullUrl(value)) {
        result[key] = value;
        continue;
      }

      // Validate locale key
      if (!isValidLocale(key)) {
        throw new Error(
          `Invalid locale "${key}" in alternates for "${entry.id}". ` +
            `Valid locales: ${locales.join(", ")}`
        );
      }

      // Slug = local page, verify it exists
      const normalizedSlug = value.replace(/^\//, "");
      const targetEntry = allEntries.find(
        (e) =>
          getLocaleFromId(e.id) === key &&
          getUrlSlug(e) === normalizedSlug
      );

      if (!targetEntry) {
        throw new Error(
          `Alternate "${key}: ${value}" in "${entry.id}" points to non-existent page. ` +
            `No page found with locale "${key}" and slug "${normalizedSlug}".`
        );
      }

      result[key] = buildLocalUrl(key as Locale, getUrlSlug(targetEntry));
    }
    return result;
  }

  // Auto-find pages with matching base path
  const currentBasePath = getBasePath(entry.id);

  for (const other of allEntries) {
    const otherLocale = getLocaleFromId(other.id);
    if (otherLocale === currentLocale) continue;
    if (result[otherLocale]) continue; // Already found

    const otherBasePath = getBasePath(other.id);

    // Check if other entry links back to current via alternates
    const linksBack = other.data.alternates
      ? Object.entries(other.data.alternates).some(
          ([loc, slug]) =>
            isValidLocale(loc) &&
            loc === currentLocale &&
            !isFullUrl(slug) &&
            slug.replace(/^\//, "") === currentSlug
        )
      : false;

    // Match by base path (if no alternates defined) or by back-link
    if (
      (!other.data.alternates && otherBasePath === currentBasePath) ||
      linksBack
    ) {
      result[otherLocale] = buildLocalUrl(otherLocale, getUrlSlug(other));
    }
  }

  return result;
}

/**
 * Get locales that don't have this page available.
 */
export function getMissingLocales(alternates: Record<string, string>): Locale[] {
  return locales.filter((locale) => !(locale in alternates));
}


