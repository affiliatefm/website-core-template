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
      id: "paper",
      label: "Paper",
      path: "./src/templates/affiliate/styles/paper.css",
    },
    {
      id: "studio",
      label: "Studio",
      path: "./src/templates/affiliate/styles/studio.css",
    },
  ],
} as const satisfies TemplateDefinition;
