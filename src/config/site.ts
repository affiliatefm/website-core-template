import { siteUrl, locales, defaultLocale, template as siteTemplate } from "../data/site";
import { uiStrings } from "../data/ui";

export { siteUrl };

export const languages = locales;
export const defaultLanguage = defaultLocale;
export type LanguageCode = (typeof locales)[number];

export const ui = uiStrings;
export type UIStrings = (typeof uiStrings)[LanguageCode];

export const templateId = siteTemplate.trim().toLowerCase();
