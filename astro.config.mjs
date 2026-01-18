import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import { siteUrl, languages, defaultLanguage } from "./src/config/site.ts";
import { checksIntegration } from "./src/integrations/checks.ts";
import aiTranslator from "@affiliate.fm/astro-content-ai-translator";

export default defineConfig({
  site: siteUrl,

  integrations: [mdx(), tailwind(), preact(), checksIntegration(), aiTranslator()],

  trailingSlash: "always",

  i18n: {
    locales: [...languages],
    defaultLocale: defaultLanguage,
    routing: {
      prefixDefaultLocale: false,
    },
  },

});
