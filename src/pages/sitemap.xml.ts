/**
 * Custom Sitemap with i18n Support
 * =================================
 * Generates sitemap.xml with xhtml:link tags for alternate language versions.
 *
 * Standard @astrojs/sitemap doesn't support custom alternate URLs
 * (e.g., /about ↔ /ru/o-nas), so we generate it manually.
 */

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { defaultLanguage } from "@/config/site";
import {
  getLanguageFromId,
  getUrlSlug,
  getAlternateUrls,
  getAbsoluteLanguageUrl,
  toHreflang,
} from "@/i18n";

export const GET: APIRoute = async () => {
  const allPages = await getCollection("pages", ({ data }) => !data.draft);

  // Build URL entries with alternates
  const urlEntries: Array<{
    loc: string;
    lastmod?: string;
    alternates: Record<string, string>;
  }> = [];

  for (const entry of allPages) {
    const language = getLanguageFromId(entry.id);
    const slug = getUrlSlug(entry);
    const loc = getAbsoluteLanguageUrl(language, slug);
    const alternates = getAlternateUrls(entry, allPages, { absolute: true });

    // Use updatedAt from frontmatter, or undefined (will be omitted)
    const lastmod = entry.data.updatedAt
      ? entry.data.updatedAt.toISOString().split("T")[0]
      : undefined;

    urlEntries.push({ loc, lastmod, alternates });
  }

  // Generate XML
  const xml = generateSitemapXml(urlEntries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};

function generateSitemapXml(
  entries: Array<{ loc: string; lastmod?: string; alternates: Record<string, string> }>
): string {
  const urlElements = entries.map((entry) => {
    // Convert language codes to BCP 47 format for hreflang
    const alternateLinks = Object.entries(entry.alternates)
      .map(
        ([lang, href]) =>
          `    <xhtml:link rel="alternate" hreflang="${toHreflang(lang)}" href="${escapeXml(href)}" />`
      )
      .join("\n");

    // Add x-default pointing to default language version
    const xDefaultUrl = entry.alternates[defaultLanguage] || entry.loc;
    const xDefaultLink =
      Object.keys(entry.alternates).length > 1
        ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefaultUrl)}" />`
        : "";

    // Optional lastmod
    const lastmodTag = entry.lastmod
      ? `\n    <lastmod>${entry.lastmod}</lastmod>`
      : "";

    return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${lastmodTag}
${alternateLinks}${xDefaultLink}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlElements.join("\n")}
</urlset>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
