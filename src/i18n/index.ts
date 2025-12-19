/**
 * i18n Module
 * ============
 * Re-exports site config and provides utility functions.
 *
 * Usage in components:
 *   import { languages, defaultLanguage, t, getLanguageFromId } from "@/i18n";
 *   import { getAbsoluteLanguageUrl, toHreflang } from "@/i18n";
 */

export {
  languages,
  defaultLanguage,
  type LanguageCode,
} from "@/config/site";

export * from "./utils";
