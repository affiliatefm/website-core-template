/**
 * Dynamic robots.txt
 * ==================
 * Generates robots.txt with sitemap URL from site config.
 */

import type { APIRoute } from "astro";
import { siteUrl } from "@/config/site";

export const GET: APIRoute = () => {
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  const content = `# Robots.txt
# https://www.robotstxt.org/

User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};


