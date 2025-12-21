import { siteUrl, locales, defaultLocale, layoutPath } from "../data/site";
import { uiStrings } from "../data/ui";

export { siteUrl, layoutPath };

export const languages = locales;
export const defaultLanguage = defaultLocale;
export type LanguageCode = (typeof locales)[number];

export const ui = uiStrings;
export type UIStrings = (typeof uiStrings)[LanguageCode];
