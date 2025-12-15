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
  domains,
  ui,
  type Locale,
} from "@/config/site";

// =============================================================================
// LOCALE VALIDATION
// =============================================================================

/**
 * Check if a string is a valid locale.
 */
export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
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
 * - "docs/getting-started" → "docs/getting-started"
 * - "ru/index" → ""
 * - "ru/about" → "about"
 * - "ru/docs/getting-started" → "docs/getting-started"
 */
export function getBasePath(id: string): string {
  const locale = getLocaleFromId(id);

  let path = id;

  // Remove locale prefix for non-default locales
  if (locale !== defaultLocale) {
    path = path.replace(new RegExp(`^${locale}/`), "");
  }

  // "index" → "" (homepage)
  return path === "index" ? "" : path;
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
// DOMAIN HELPERS
// =============================================================================

/**
 * Get the origin (domain) for a specific locale.
 * Falls back to siteUrl if no custom domain is configured.
 *
 * Examples (with domains config):
 * - getLocaleOrigin("en") → "https://example.com"
 * - getLocaleOrigin("fr") → "https://fr.example.com"
 * - getLocaleOrigin("es") → "https://example.es"
 */
export function getLocaleOrigin(locale: Locale): string {
  const domain = domains[locale];
  if (domain) {
    // Ensure trailing slash for consistent URL joining
    return domain.endsWith("/") ? domain.slice(0, -1) : domain;
  }
  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
}

/**
 * Build absolute URL for a locale, respecting domain configuration.
 *
 * For locales with custom domains (subdomains, ccTLDs):
 * - The locale prefix is typically NOT included in the path
 * - e.g., fr.example.com/about (not fr.example.com/fr/about)
 *
 * For locales on the main domain:
 * - The locale prefix IS included (except for defaultLocale)
 * - e.g., example.com/ru/about
 */
export function getAbsoluteLocaleUrl(locale: Locale, slug: string): string {
  const origin = getLocaleOrigin(locale);
  const hasCustomDomain = !!domains[locale];

  // If locale has its own domain, don't add locale prefix to path
  // (the domain itself identifies the locale)
  if (hasCustomDomain) {
    const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
    const path = normalizedSlug === "/" ? "/" : `${normalizedSlug}/`;
    return `${origin}${path}`;
  }

  // Otherwise use Astro's relative URL and combine with origin
  const relative = getRelativeLocaleUrl(locale, slug);
  return `${origin}${relative}`;
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
 * Get alternate language URLs for a page.
 * Used for hreflang tags and language switcher.
 *
 * Resolution logic:
 * 1. If entry has explicit `alternates` in frontmatter → use those
 * 2. Otherwise → auto-find pages with matching base path in other locales
 *
 * When `absolute: true`, uses domain configuration for proper multi-domain URLs.
 */
export function getAlternateUrls(
  entry: PageEntry,
  allEntries: PageEntry[],
  options?: { absolute?: boolean }
): Record<string, string> {
  const result: Record<string, string> = {};
  const currentLocale = getLocaleFromId(entry.id);
  const currentSlug = getUrlSlug(entry);

  // Helper to build URL (respects domain config when absolute)
  const buildUrl = (locale: Locale, slug: string): string => {
    if (!options?.absolute) {
      return getRelativeLocaleUrl(locale, slug);
    }
    return getAbsoluteLocaleUrl(locale, slug);
  };

  // Always include current page
  result[currentLocale] = buildUrl(currentLocale, currentSlug);

  // If explicit alternates defined → use them
  if (entry.data.alternates) {
    for (const [locale, targetSlug] of Object.entries(entry.data.alternates)) {
      if (!isValidLocale(locale) || locale === currentLocale) continue;

      // Verify target page exists
      const targetEntry = allEntries.find(
        (e) =>
          getLocaleFromId(e.id) === locale &&
          getUrlSlug(e) === targetSlug.replace(/^\//, "")
      );

      if (targetEntry) {
        result[locale] = buildUrl(locale as Locale, getUrlSlug(targetEntry));
      }
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
            slug.replace(/^\//, "") === currentSlug
        )
      : false;

    // Match by base path (if no alternates defined) or by back-link
    if (
      (!other.data.alternates && otherBasePath === currentBasePath) ||
      linksBack
    ) {
      result[otherLocale] = buildUrl(otherLocale, getUrlSlug(other));
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
