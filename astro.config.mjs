import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { locales, defaultLocale } from "./src/i18n/config";

export default defineConfig({
  integrations: [mdx()],

  trailingSlash: "always",

  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
