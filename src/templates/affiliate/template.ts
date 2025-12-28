import type { TemplateDefinition } from "../types";

export const affiliateTemplate = {
  id: "affiliate",
  name: "Affiliate",
  layout: "./src/templates/affiliate/Layout.astro",
  i18n: "./src/templates/affiliate/i18n.ts",
  pages: [
    {
      id: "article",
      path: "./src/templates/affiliate/pages/Article.astro",
    },
    {
      id: "product",
      path: "./src/templates/affiliate/pages/Product.astro",
    },
  ],
  styles: [
    {
      id: "light",
      label: "Light",
      path: "./src/templates/affiliate/styles/light.css",
    },
    {
      id: "dark",
      label: "Dark",
      path: "./src/templates/affiliate/styles/dark.css",
    },
  ],
} as const satisfies TemplateDefinition;
