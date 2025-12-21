/**
 * Affiliate Template Translations
 * ================================
 * Internal translations for the affiliate template.
 * These are part of the template, not user data.
 * 
 * Follows the same pattern as @/i18n for consistency.
 */

import { defaultLanguage, type LanguageCode } from "../../config/site";

export interface TemplateStrings {
  home: string;
  docs: string;
  software: string;
  websites: string;
  linkLabel: string;
  visitLink: string;
  backToHome: string;
}

export const translations: Record<string, TemplateStrings> = {
  en: {
    home: "Home",
    docs: "Docs",
    software: "Software",
    websites: "Websites",
    linkLabel: "Link",
    visitLink: "Visit",
    backToHome: "Back to home",
  },
  ru: {
    home: "Главная",
    docs: "Документация",
    software: "Софт",
    websites: "Сайты",
    linkLabel: "Ссылка",
    visitLink: "Перейти",
    backToHome: "На главную",
  },
};

/**
 * Get template translations for a language.
 * Falls back to default language, then to English.
 */
export function tt(language: LanguageCode): TemplateStrings {
  return translations[language] ?? translations[defaultLanguage] ?? translations.en;
}
