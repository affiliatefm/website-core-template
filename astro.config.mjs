import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { locales, defaultLocale, siteUrl } from "./src/config/site.ts";

export default defineConfig({
  site: siteUrl,

  integrations: [mdx(), sitemap()],

  trailingSlash: "always",

  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
