import { siteUrl, locales, defaultLocale } from "../data/site";
import { selectedTemplate, selectedTemplateStyle, templateStylePath } from "../templates";
import { uiStrings } from "../data/ui";

export { siteUrl };

export const languages = locales;
export const defaultLanguage = defaultLocale;
export type LanguageCode = (typeof locales)[number];

export const ui = uiStrings;
export type UIStrings = (typeof uiStrings)[LanguageCode];

export const templateId = selectedTemplate.id;
export const templateStyleId = selectedTemplateStyle.id;
export const templateLayoutPath = selectedTemplate.layout;
export { templateStylePath };
