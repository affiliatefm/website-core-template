import { siteUrl, locales, defaultLocale } from "../data/site";
import { uiStrings } from "../data/ui";

export { siteUrl };

export const languages = locales;
export const defaultLanguage = defaultLocale;
export type LanguageCode = (typeof locales)[number];

export const ui = uiStrings;
export type UIStrings = (typeof uiStrings)[LanguageCode];

/**
 * Layout path — choose your template:
 *   - "./src/layouts/basic/Layout.astro"     — minimal, text-focused
 *   - "./src/layouts/affiliate/Layout.astro" — affiliate site with Tailwind
 */
export const layoutPath = "./src/layouts/affiliate/Layout.astro";
