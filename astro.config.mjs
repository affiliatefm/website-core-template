import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { fileURLToPath } from "node:url";
import { locales, defaultLocale, siteUrl, template } from "./src/config/site.ts";
import { checksIntegration } from "./src/integrations/checks.ts";
import aiTranslator from "@affiliate.fm/astro-content-astro-ai-translator";

export default defineConfig({
  site: siteUrl,

  integrations: [mdx(), checksIntegration(), aiTranslator()],

  trailingSlash: "always",

  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    resolve: {
      alias: {
        // Virtual alias for the active template's Layout
        // Usage: import Layout from "#layout"
        "#layout": fileURLToPath(
          new URL(`./src/layouts/${template}/Layout.astro`, import.meta.url)
        ),
      },
    },
  },
});
