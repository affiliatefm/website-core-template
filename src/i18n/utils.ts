/**
 * i18n Utility Functions
 * =======================
 * Helper functions for internationalization.
 */

import { getRelativeLocaleUrl } from "astro:i18n";
import {
  languages,
  defaultLanguage,
  type LanguageCode,
  siteUrl,
  ui as messages,
} from "@/config/site";

// =============================================================================
// LANGUAGE VALIDATION & NORMALIZATION
// =============================================================================

/**
 * Check if a string is a supported language code.
 */
export function isSupportedLanguage(value: string): value is LanguageCode {
  return languages.includes(value as LanguageCode);
}

/**
 * Convert a code to BCP 47 format for hreflang tags.
 */
export function toHreflang(code: string): string {
  const parts = code.split("-");

  if (parts.length === 1) {
    return parts[0].toLowerCase();
  }

  if (parts.length === 2) {
    const [language, regionOrScript] = parts;

    if (regionOrScript.length === 4) {
      return `${language.toLowerCase()}-${
        regionOrScript.charAt(0).toUpperCase() + regionOrScript.slice(1).toLowerCase()
      }`;
    }

    return `${language.toLowerCase()}-${regionOrScript.toUpperCase()}`;
  }

  if (parts.length === 3) {
    const [language, script, region] = parts;
    return `${language.toLowerCase()}-${
      script.charAt(0).toUpperCase() + script.slice(1).toLowerCase()
    }-${region.toUpperCase()}`;
  }

  return code;
}

// =============================================================================
// TRANSLATIONS
// =============================================================================

/**
 * Get UI translations for a language, falling back to the default language.
 */
export function t(language: LanguageCode) {
  return messages[language] ?? messages[defaultLanguage];
}

// =============================================================================
// CONTENT COLLECTION HELPERS
// =============================================================================

/**
 * Extract language code from content entry ID.
 */
export function getLanguageFromId(id: string): LanguageCode {
  const firstSegment = id.split("/")[0];
  return isSupportedLanguage(firstSegment) ? firstSegment : defaultLanguage;
}

/**
 * Get the base path from an entry ID (path without language prefix).
 */
export function getBasePath(id: string): string {
  const language = getLanguageFromId(id);
  let path = id;

  if (language !== defaultLanguage) {
    path = path.replace(new RegExp(`^${language}/`), "");
  }

  if (path === "index") {
    return "";
  }

  return path.replace(/\/index$/, "");
}

/**
 * Get URL slug for an entry.
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
  const language = getLanguageFromId(entry.id);
  const slug = getUrlSlug(entry);
  return getRelativeLocaleUrl(language, slug);
}

// =============================================================================
// URL HELPERS
// =============================================================================

function getOrigin(): string {
  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
}

/**
 * Build absolute URL for a language.
 */
export function getAbsoluteLanguageUrl(language: LanguageCode, slug: string) {
  const relative = getRelativeLocaleUrl(language, slug);
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

function isFullUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

/**
 * Get alternate language URLs for a page.
 * 
 * Logic:
 * 1. Auto-link pages with same basePath
 * 2. Override/extend with explicit alternates (supports external URLs)
 */
export function getAlternateUrls(
  entry: PageEntry,
  allEntries: PageEntry[],
  options?: { absolute?: boolean }
): Record<string, string> {
  const result: Record<string, string> = {};
  const currentLanguage = getLanguageFromId(entry.id);
  const currentSlug = getUrlSlug(entry);
  const currentBasePath = getBasePath(entry.id);

  const buildLocalUrl = (language: LanguageCode, slug: string): string => {
    if (options?.absolute) {
      return getAbsoluteLanguageUrl(language, slug);
    }
    return getRelativeLocaleUrl(language, slug);
  };

  // Add current page
  result[currentLanguage] = buildLocalUrl(currentLanguage, currentSlug);

  // Auto-link pages with same basePath
  for (const other of allEntries) {
    const otherLanguage = getLanguageFromId(other.id);
    if (otherLanguage === currentLanguage) continue;

    const otherBasePath = getBasePath(other.id);
    if (otherBasePath === currentBasePath) {
      result[otherLanguage] = buildLocalUrl(otherLanguage, getUrlSlug(other));
    }
  }

  // Override/extend with explicit alternates
  if (entry.data.alternates) {
    for (const [key, value] of Object.entries(entry.data.alternates)) {
      if (key === currentLanguage) continue;

      // External URL — use as-is
      if (isFullUrl(value)) {
        result[key] = value;
        continue;
      }

      // Empty string or same slug — use current page URL for this language
      const normalizedSlug = value.replace(/^\//, "");
      if (normalizedSlug === "" || normalizedSlug === currentSlug) {
        result[key] = buildLocalUrl(currentLanguage, currentSlug);
        continue;
      }

      if (!isSupportedLanguage(key)) continue;

      // Local slug — find the entry
      const targetEntry = allEntries.find(
        (candidate) =>
          getLanguageFromId(candidate.id) === key &&
          getUrlSlug(candidate) === normalizedSlug
      );

      if (targetEntry) {
        result[key] = buildLocalUrl(key as LanguageCode, getUrlSlug(targetEntry));
      }
    }
  }

  return result;
}

/**
 * Get languages that don't have this page available.
 */
export function getMissingLanguages(
  alternates: Record<string, string>
): LanguageCode[] {
  return languages.filter((language) => !(language in alternates));
}
