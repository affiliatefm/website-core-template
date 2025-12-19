import { siteUrl, locales, defaultLocale } from "../data/site";
import { uiStrings } from "../data/ui";

export { siteUrl };

export const languages = locales;
export const defaultLanguage = defaultLocale;
export type LanguageCode = (typeof locales)[number];

export const ui = uiStrings;
export type UIStrings = (typeof uiStrings)[LanguageCode];

export const layoutPath = "./src/layouts/basic/Layout.astro";
