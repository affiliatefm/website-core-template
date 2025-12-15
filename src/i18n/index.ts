/**
 * i18n Module
 * ============
 * Re-exports site config and provides utility functions.
 *
 * Usage in components:
 *   import { locales, defaultLocale, t, getLocaleFromId } from "@/i18n";
 *   import { getAbsoluteLocaleUrl } from "@/i18n";
 */

// Re-export all config from site.ts
export {
  locales,
  defaultLocale,
  localeLabels,
  siteUrl,
  ui,
  type Locale,
  type UIConfig,
  type NavItem,
} from "@/config/site";

// Export utility functions
export * from "./utils";
