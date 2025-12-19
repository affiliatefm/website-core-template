import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { fileURLToPath } from "node:url";
import {
  languages,
  defaultLanguage,
  siteUrl,
  layoutPath,
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
        // Virtual alias for the default layout
        // Usage: import Layout from "#layout"
        "#layout": fileURLToPath(new URL(layoutPath, import.meta.url)),
      },
    },
  },
});
