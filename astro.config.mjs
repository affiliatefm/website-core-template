import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { fileURLToPath } from "node:url";
import {
  siteUrl,
  layoutPath,
  languages,
  defaultLanguage,
} from "./src/config/site.ts";
import { checksIntegration } from "./src/integrations/checks.ts";
import aiTranslator from "@affiliate.fm/astro-content-ai-translator";

export default defineConfig({
  site: siteUrl,

  integrations: [mdx(), checksIntegration(), aiTranslator()],

  trailingSlash: "always",

  i18n: {
    locales: [...languages],
    defaultLocale: defaultLanguage,
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    resolve: {
      alias: {
        "#layout": fileURLToPath(new URL(layoutPath, import.meta.url)),
      },
    },
  },
});
