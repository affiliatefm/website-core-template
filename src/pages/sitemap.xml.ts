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
import {
  locales,
  defaultLocale,
  getLocaleFromId,
  getUrlSlug,
  getAlternateUrls,
  getAbsoluteLocaleUrl,
} from "@/i18n";

export const GET: APIRoute = async () => {
  const allPages = await getCollection("pages", ({ data }) => !data.draft);

  // Build URL entries with alternates
  const urlEntries: Array<{
    loc: string;
    alternates: Record<string, string>;
  }> = [];

  for (const entry of allPages) {
    const locale = getLocaleFromId(entry.id);
    const slug = getUrlSlug(entry);
    const loc = getAbsoluteLocaleUrl(locale, slug);
    const alternates = getAlternateUrls(entry, allPages, { absolute: true });

    urlEntries.push({ loc, alternates });
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
  entries: Array<{ loc: string; alternates: Record<string, string> }>
): string {
  const urlElements = entries.map((entry) => {
    const alternateLinks = Object.entries(entry.alternates)
      .map(
        ([lang, href]) =>
          `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}" />`
      )
      .join("\n");

    // Add x-default pointing to default locale version
    const xDefaultUrl = entry.alternates[defaultLocale] || entry.loc;
    const xDefaultLink =
      Object.keys(entry.alternates).length > 1
        ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefaultUrl)}" />`
        : "";

    return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
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
