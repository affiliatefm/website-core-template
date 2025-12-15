/**
 * i18n Utility Functions
 */

import { getRelativeLocaleUrl } from "astro:i18n";
import { defaultLocale, locales, isValidLocale, type Locale } from "./config";
import translations from "./translations";

/**
 * Get translations for a locale
 */
export function t(locale: Locale) {
  return translations[locale] ?? translations[defaultLocale];
}

function normalizeSlug(slug: string): string {
  return slug.replace(/^\//, "");
}

/**
 * Extract locale from entry ID
 * 
 * ID examples (with generateId keeping full path):
 * - "index" → defaultLocale
 * - "about" → defaultLocale
 * - "docs/getting-started" → defaultLocale
 * - "ru/index" → "ru"
 * - "ru/about" → "ru"
 * - "ru/docs/getting-started" → "ru"
 */
export function getLocaleFromId(id: string): Locale {
  const firstSegment = id.split("/")[0];
  if (isValidLocale(firstSegment)) {
    return firstSegment;
  }
  return defaultLocale;
}

/**
 * Get base path from entry ID (path within locale, for matching translations)
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
  if (path === "index") {
    return "";
  }
  
  return path;
}

/**
 * Get URL slug for an entry
 * Uses permalink from frontmatter if provided, otherwise base path
 */
export function getUrlSlug(entry: { id: string; data: { permalink?: string } }): string {
  if (entry.data.permalink && entry.data.permalink.trim().length > 0) {
    return normalizeSlug(entry.data.permalink);
  }
  return getBasePath(entry.id);
}

/**
 * Build full URL path for a page
 */
export function getPageUrl(entry: { id: string; data: { permalink?: string } }): string {
  const locale = getLocaleFromId(entry.id);
  const slug = getUrlSlug(entry);
  return getRelativeLocaleUrl(locale, slug);
}

type PageEntry = { id: string; data: { permalink?: string; alternates?: Record<string, string> } };

function findEntryByLocaleAndSlug(locale: Locale, slug: string, entries: PageEntry[]) {
  const targetSlug = normalizeSlug(slug);
  return entries.find(
    (candidate) =>
      getLocaleFromId(candidate.id) === locale && getUrlSlug(candidate) === targetSlug
  );
}

/**
 * Get alternate language URLs for a page
 * 
 * Logic:
 * 1. If page has explicit `alternates` → use them (for custom URL mappings)
 * 2. Otherwise → auto-find pages with same base path in other locales
 */
export function getAlternateUrls(
  entry: PageEntry,
  allEntries: PageEntry[]
): Record<string, string> {
  const result: Record<string, string> = {};
  const currentLocale = getLocaleFromId(entry.id);
  const currentSlug = getUrlSlug(entry);
  
  // Always include current page
  result[currentLocale] = getPageUrl(entry);

  // If explicit alternates defined → use them for OTHER locales
  if (entry.data.alternates) {
    for (const [locale, slug] of Object.entries(entry.data.alternates)) {
      if (!isValidLocale(locale) || locale === currentLocale) continue;

      const matchedEntry = findEntryByLocaleAndSlug(locale, slug, allEntries);
      if (!matchedEntry) {
        throw new Error(
          `Alternate mapping for "${entry.id}" points to missing page: ${locale}:${slug}`
        );
      }

      result[locale] = getPageUrl(matchedEntry);
    }
    return result;
  }

  // Auto-find pages with matching base path
  const currentBasePath = getBasePath(entry.id);

  for (const other of allEntries) {
    const otherLocale = getLocaleFromId(other.id);
    
    // Skip same locale
    if (otherLocale === currentLocale) continue;

    const otherBasePath = getBasePath(other.id);
    const otherAlternates = other.data.alternates;
    const otherSlug = getUrlSlug(other);

    const linksToCurrent =
      !!otherAlternates &&
      Object.entries(otherAlternates).some(
        ([loc, slug]) =>
          isValidLocale(loc) &&
          loc === currentLocale &&
          normalizeSlug(slug) === currentSlug
      );

    const canAutoPair = !otherAlternates && otherBasePath === currentBasePath;

    if ((linksToCurrent || canAutoPair) && !result[otherLocale]) {
      result[otherLocale] = getPageUrl(other);
    }
  }

  return result;
}

/**
 * Get all locales that DON'T have this page
 */
export function getMissingLocales(alternates: Record<string, string>): Locale[] {
  return locales.filter((locale) => !(locale in alternates));
}
