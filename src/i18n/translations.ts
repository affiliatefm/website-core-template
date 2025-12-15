/**
 * UI Translations
 * Includes navigation links with locale-specific paths
 */

import type { Locale } from "./config";

type NavLink = {
  path: string;
  label: string;
};

type Translations = {
  nav: {
    links: NavLink[];
  };
  ui: {
    readMore: string;
    backToHome: string;
  };
  meta: {
    siteName: string;
  };
};

const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      links: [
        { path: "", label: "Home" },
        { path: "about", label: "About" },
        { path: "docs/getting-started", label: "Docs" },
        { path: "contact", label: "Contact" },
      ],
    },
    ui: {
      readMore: "Read more",
      backToHome: "Back to home",
    },
    meta: {
      siteName: "i18n Demo",
    },
  },
  ru: {
    nav: {
      links: [
        { path: "", label: "Главная" },
        { path: "o-nas", label: "О нас" },
        { path: "docs/getting-started", label: "Документация" },
      ],
    },
    ui: {
      readMore: "Читать далее",
      backToHome: "На главную",
    },
    meta: {
      siteName: "i18n Демо",
    },
  },
  fr: {
    nav: {
      links: [
        { path: "", label: "Accueil" },
      ],
    },
    ui: {
      readMore: "Lire plus",
      backToHome: "Retour à l'accueil",
    },
    meta: {
      siteName: "Démo i18n",
    },
  },
  es: {
    nav: {
      links: [
        { path: "", label: "Inicio" },
      ],
    },
    ui: {
      readMore: "Leer más",
      backToHome: "Volver al inicio",
    },
    meta: {
      siteName: "Demo i18n",
    },
  },
  ja: {
    nav: {
      links: [
        { path: "", label: "ホーム" },
      ],
    },
    ui: {
      readMore: "続きを読む",
      backToHome: "ホームに戻る",
    },
    meta: {
      siteName: "i18nデモ",
    },
  },
};

export default translations;
