import { siteUrl, defaultLanguage, locales } from "../data/site";
import { uiStrings } from "../data/ui";

export { siteUrl, defaultLanguage };

export const languages = locales;
export type LanguageCode = (typeof locales)[number];

export const ui = uiStrings;
export type UIStrings = (typeof uiStrings)[LanguageCode];

export const layoutPath = "./src/layouts/basic/Layout.astro";
