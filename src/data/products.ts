/**
 * Products Data
 * =============
 * Affiliate.FM open-source ecosystem showcase.
 */

import type { Product, Category } from "@/layouts/affiliate/types";

export type { Product, Category };

// =============================================================================
// CATEGORIES
// =============================================================================

export const categories: Category[] = [
  { id: "cat-1", name: "Templates", slug: "templates" },
  { id: "cat-2", name: "AI Tools", slug: "ai-tools" },
  { id: "cat-3", name: "Websites", slug: "websites" },
];

// =============================================================================
// PRODUCTS (Affiliate.FM Ecosystem)
// =============================================================================

export const products: Product[] = [
  {
    id: "website-core-template",
    name: "website-core-template",
    description: "Minimal Astro 5 template for multilingual static sites.",
    image: "https://placehold.co/80x80/1f2937/fff?text=WCT",
    category: "templates",
    rating: 5.0,
    reviewCount: 51,
    priceLabel: "Free & Open Source",
    affiliateUrl: "https://github.com/affiliatefm/website-core-template",
    pageUrl: "/",
    pros: ["Zero config to start", "Multi-language ready", "Update-safe architecture"],
    cons: ["Astro-only", "Requires Node.js"],
    rank: 1,
    featured: true,
  },
  {
    id: "astro-content-ai-translator",
    name: "astro-content-ai-translator",
    description: "AI-powered translation for Astro content collections.",
    image: "https://placehold.co/80x80/3b82f6/fff?text=AIT",
    category: "ai-tools",
    rating: 4.8,
    reviewCount: 11,
    priceLabel: "Free (OpenAI API)",
    affiliateUrl: "https://github.com/affiliatefm/astro-content-ai-translator",
    pageUrl: "/ai-translator/",
    pros: ["Cost estimates before translation", "Supports all OpenAI models", "Preserves frontmatter"],
    cons: ["Requires OpenAI API key"],
    rank: 2,
  },
  {
    id: "astro-content-ai-enhancer",
    name: "astro-content-ai-enhancer",
    description: "AI assistant that turns raw Markdown into structured pages.",
    image: "https://placehold.co/80x80/10b981/fff?text=AIE",
    category: "ai-tools",
    rating: 4.7,
    reviewCount: 2,
    priceLabel: "Free (OpenAI API)",
    affiliateUrl: "https://github.com/affiliatefm/astro-content-ai-enhancer",
    pageUrl: "/ai-enhancer/",
    pros: ["Enhances structure", "Adds rich blocks", "Keeps your voice"],
    cons: ["Early development"],
    rank: 3,
  },
  {
    id: "staticsitegenerators-net",
    name: "staticsitegenerators.net",
    description: "Directory of static site generators. Built with website-core-template.",
    image: "https://placehold.co/80x80/8b5cf6/fff?text=SSG",
    category: "websites",
    rating: 4.5,
    reviewCount: 9,
    priceLabel: "Live Website",
    affiliateUrl: "https://staticsitegenerators.net",
    pageUrl: "/ssg-directory/",
    pros: ["Real-world example", "Multi-language", "Auto-deployed"],
    cons: ["Work in progress"],
    rank: 4,
  },
];

// =============================================================================
// HELPERS
// =============================================================================

export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const getProductsByRank = () => [...products].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
