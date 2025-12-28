/**
 * Affiliate Template Translations
 * ================================
 * Internal translations for the affiliate template.
 * These are part of the template, not user data.
 */

import { defaultLanguage, type LanguageCode } from "../../config/site";

export interface TemplateStrings {
  home: string;
  software: string;
  websites: string;
  productLabel: string;
  linkLabel: string;
  visitLink: string;
  backToHome: string;
}

export const translations: Record<string, TemplateStrings> = {
  en: {
    home: "Home",
    software: "Software",
    websites: "Websites",
    productLabel: "Product",
    linkLabel: "Link",
    visitLink: "Visit",
    backToHome: "Back to home",
  },
  ru: {
    home: "Главная",
    software: "Софт",
    websites: "Сайты",
    productLabel: "Продукт",
    linkLabel: "Ссылка",
    visitLink: "Перейти",
    backToHome: "На главную",
  },
  ja: {
    home: "ホーム",
    software: "ソフトウェア",
    websites: "ウェブサイト",
    productLabel: "製品",
    linkLabel: "リンク",
    visitLink: "訪問",
    backToHome: "ホームに戻る",
  },
};

/**
 * Get template translations for a language.
 * Falls back to default language, then to English.
 */
export function tt(language: LanguageCode): TemplateStrings {
  return translations[language] ?? translations[defaultLanguage] ?? translations.en;
}
