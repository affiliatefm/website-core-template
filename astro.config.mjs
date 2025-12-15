import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { locales, defaultLocale, siteUrl } from "./src/config/site.ts";
import { checksIntegration } from "./src/integrations/checks.ts";

export default defineConfig({
  site: siteUrl,

  integrations: [mdx(), checksIntegration()],

  trailingSlash: "always",

  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
      // Note: `fallback` is not used here because:
      // 1. For static builds, it creates duplicate pages for missing translations
      // 2. Our content-driven approach with getStaticPaths handles this explicitly
      // 3. Missing translations are intentionally shown as unavailable in language switcher
    },
  },
});
