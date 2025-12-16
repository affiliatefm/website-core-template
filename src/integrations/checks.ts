/**
 * Build Checks Integration
 * =========================
 * Validates the final build output (HTML files in dist/).
 *
 * Runs after build completes and checks:
 * - Hreflang bidirectional links
 * - Consistent external alternates across linked pages
 *
 * Usage:
 *   // astro.config.mjs
 *   import { checksIntegration } from './src/integrations/checks';
 *   export default defineConfig({
 *     integrations: [checksIntegration()],
 *   });
 */

import type { AstroIntegration } from "astro";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

// =============================================================================
// TYPES
// =============================================================================

type HreflangLink = {
  hreflang: string;
  href: string;
};

type PageHreflang = {
  /** Path relative to dist, e.g. "ru/about/index.html" */
  file: string;
  /** Canonical URL of this page */
  url: string;
  /** All hreflang links found on this page */
  links: HreflangLink[];
};

type CheckError = {
  check: string;
  message: string;
  file?: string;
};

type CheckFn = (pages: PageHreflang[], siteUrl: string) => CheckError[];

type CheckConfig = {
  name: string;
  enabled?: boolean;
  run: CheckFn;
};

// =============================================================================
// HTML PARSING
// =============================================================================

/**
 * Extract hreflang links from HTML content.
 * Looks for: <link rel="alternate" hreflang="..." href="...">
 */
function parseHreflangLinks(html: string): HreflangLink[] {
  const links: HreflangLink[] = [];

  // Match <link> tags with rel="alternate" and hreflang attribute
  // Handles various attribute orders and quote styles
  const linkRegex =
    /<link[^>]*\srel=["']alternate["'][^>]*>/gi;
  const hreflangRegex = /\shreflang=["']([^"']+)["']/i;
  const hrefRegex = /\shref=["']([^"']+)["']/i;

  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const tag = match[0];
    const hreflangMatch = hreflangRegex.exec(tag);
    const hrefMatch = hrefRegex.exec(tag);

    if (hreflangMatch && hrefMatch) {
      links.push({
        hreflang: hreflangMatch[1],
        href: hrefMatch[1],
      });
    }
  }

  return links;
}

/**
 * Extract canonical URL from HTML content.
 */
function parseCanonicalUrl(html: string): string | null {
  const match = /<link[^>]*\srel=["']canonical["'][^>]*\shref=["']([^"']+)["'][^>]*>/i.exec(html);
  if (match) return match[1];

  // Try alternate attribute order
  const match2 = /<link[^>]*\shref=["']([^"']+)["'][^>]*\srel=["']canonical["'][^>]*>/i.exec(html);
  return match2 ? match2[1] : null;
}

/**
 * Recursively find all HTML files in a directory.
 */
async function findHtmlFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(fullPath)));
    } else if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Build page data from HTML files in dist/.
 */
async function buildPageData(
  distDir: string,
  siteUrl: string
): Promise<PageHreflang[]> {
  const htmlFiles = await findHtmlFiles(distDir);
  const pages: PageHreflang[] = [];

  for (const file of htmlFiles) {
    const content = await readFile(file, "utf-8");
    const relPath = relative(distDir, file);
    const links = parseHreflangLinks(content);
    const canonical = parseCanonicalUrl(content);

    // Derive URL from file path if no canonical
    // e.g., "ru/about/index.html" → "https://example.com/ru/about/"
    let url = canonical;
    if (!url) {
      const urlPath = relPath
        .replace(/index\.html$/, "")
        .replace(/\.html$/, "/");
      url = `${siteUrl.replace(/\/$/, "")}/${urlPath}`;
    }

    pages.push({ file: relPath, url, links });
  }

  return pages;
}

// =============================================================================
// CHECKS
// =============================================================================

const isExternal = (href: string, siteUrl: string): boolean => {
  if (!href.startsWith("http://") && !href.startsWith("https://")) {
    return false;
  }
  const siteOrigin = new URL(siteUrl).origin;
  try {
    return new URL(href).origin !== siteOrigin;
  } catch {
    return false;
  }
};

/**
 * Check: Hreflang links must be bidirectional.
 * If page A links to page B (hreflang), page B must link back to A.
 */
const bidirectionalLinks: CheckConfig = {
  name: "hreflang-bidirectional",
  run: (pages, siteUrl) => {
    const errors: CheckError[] = [];

    // Build a map of URL → page for quick lookup
    const pageByUrl = new Map<string, PageHreflang>();
    for (const page of pages) {
      pageByUrl.set(page.url, page);
    }

    for (const page of pages) {
      // Find self-reference to get this page's hreflang code
      const selfLink = page.links.find((l) => l.href === page.url);
      if (!selfLink) continue; // No hreflang tags on this page

      const selfHreflang = selfLink.hreflang;

      for (const link of page.links) {
        // Skip self-reference
        if (link.href === page.url) continue;

        // Skip external links
        if (isExternal(link.href, siteUrl)) continue;

        // Find the target page
        const targetPage = pageByUrl.get(link.href);
        if (!targetPage) {
          errors.push({
            check: "hreflang-bidirectional",
            message: `Links to "${link.hreflang}:${link.href}" but target page not found in build`,
            file: page.file,
          });
          continue;
        }

        // Check if target links back
        const backLink = targetPage.links.find(
          (l) => l.hreflang === selfHreflang
        );

        if (!backLink) {
          errors.push({
            check: "hreflang-bidirectional",
            message: `Links to "${link.hreflang}:${link.href}" but target doesn't link back to "${selfHreflang}"`,
            file: page.file,
          });
          continue;
        }

        // Verify back link points to this page
        if (backLink.href !== page.url) {
          errors.push({
            check: "hreflang-bidirectional",
            message: `Links to "${link.hreflang}:${link.href}" but target links "${selfHreflang}" to "${backLink.href}" instead of "${page.url}"`,
            file: page.file,
          });
        }
      }
    }

    return errors;
  },
};

/**
 * Check: Linked pages must have consistent external alternates.
 * If pages are linked via hreflang, they must all point to the same external URLs.
 */
const consistentExternals: CheckConfig = {
  name: "hreflang-consistent-externals",
  run: (pages, siteUrl) => {
    const errors: CheckError[] = [];
    const checkedPairs = new Set<string>();

    // Helper to get sorted external links as string for comparison
    const getExternalSet = (links: HreflangLink[]): string => {
      return links
        .filter((l) => isExternal(l.href, siteUrl))
        .sort((a, b) => a.hreflang.localeCompare(b.hreflang))
        .map((l) => `${l.hreflang}:${l.href}`)
        .join("|");
    };

    // Build URL → page map
    const pageByUrl = new Map<string, PageHreflang>();
    for (const page of pages) {
      pageByUrl.set(page.url, page);
    }

    for (const page of pages) {
      const pageExternals = getExternalSet(page.links);
      if (!pageExternals) continue;

      for (const link of page.links) {
        if (isExternal(link.href, siteUrl)) continue;
        if (link.href === page.url) continue;

        const targetPage = pageByUrl.get(link.href);
        if (!targetPage) continue;

        // Avoid duplicate errors
        const pairKey = [page.file, targetPage.file].sort().join("↔");
        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);

        const targetExternals = getExternalSet(targetPage.links);
        if (pageExternals !== targetExternals) {
          errors.push({
            check: "hreflang-consistent-externals",
            message: `"${page.file}" and "${targetPage.file}" have different external alternates`,
            file: page.file,
          });
        }
      }
    }

    return errors;
  },
};

// =============================================================================
// CHECKS REGISTRY
// =============================================================================

/**
 * All registered checks. Add new checks here.
 */
const checks: CheckConfig[] = [
  bidirectionalLinks,
  consistentExternals,
  // Add more checks here:
  // missingCanonical,
  // brokenInternalLinks,
];

// =============================================================================
// COLORS (ANSI)
// =============================================================================

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

// =============================================================================
// INTEGRATION
// =============================================================================

export interface ChecksOptions {
  /** Enable/disable the integration entirely */
  enabled?: boolean;
  /** Fail build on errors (default: true) */
  failOnError?: boolean;
}

/**
 * Astro integration for build-time checks.
 * Validates the final HTML output in dist/.
 */
export function checksIntegration(options: ChecksOptions = {}): AstroIntegration {
  const { enabled = true, failOnError = true } = options;

  let siteUrl: string | undefined;

  return {
    name: "build-checks",
    hooks: {
      // Capture site URL from Astro config before build
      "astro:config:done": ({ config }) => {
        siteUrl = config.site;
      },

      "astro:build:done": async ({ dir, logger }) => {
        if (!enabled) {
          logger.info("Build checks disabled");
          return;
        }

        if (!siteUrl) {
          logger.warn("No site URL configured, skipping hreflang checks");
          return;
        }

        const distDir = dir.pathname;

        logger.info("Scanning build output...");

        const pages = await buildPageData(distDir, siteUrl);
        const pagesWithHreflang = pages.filter((p) => p.links.length > 0);

        if (pagesWithHreflang.length === 0) {
          logger.info("No hreflang tags found, skipping checks");
          return;
        }

        logger.info(`Found ${pagesWithHreflang.length} pages with hreflang tags`);

        // Warn about external alternates (cannot be validated)
        const externalLinks = pagesWithHreflang.flatMap((p) =>
          p.links.filter((l) => isExternal(l.href, siteUrl))
        );
        if (externalLinks.length > 0) {
          const uniqueExternalDomains = [
            ...new Set(externalLinks.map((l) => new URL(l.href).origin)),
          ];
          logger.warn(
            `Found ${externalLinks.length} external hreflang link(s) to: ${uniqueExternalDomains.join(", ")}`
          );
          logger.warn(
            `External sites MUST have reciprocal hreflang links pointing back. This cannot be validated automatically.`
          );
        }

        // Run checks
        let totalErrors = 0;
        const results: { name: string; errors: CheckError[]; time: number }[] = [];

        console.log(`\n${c.cyan}${c.bold}Running build checks...${c.reset}\n`);

        for (const check of checks) {
          if (check.enabled === false) continue;

          const start = performance.now();
          const errors = check.run(pagesWithHreflang, siteUrl);
          const time = performance.now() - start;

          results.push({ name: check.name, errors, time });
          totalErrors += errors.length;

          if (errors.length === 0) {
            console.log(
              `  ${c.green}✓${c.reset} ${check.name} ${c.gray}(${time.toFixed(0)}ms)${c.reset}`
            );
          } else {
            console.log(
              `  ${c.red}✗${c.reset} ${check.name} ${c.gray}(${time.toFixed(0)}ms)${c.reset}`
            );
            for (const err of errors) {
              console.log(`    ${c.red}→${c.reset} ${c.dim}${err.message}${c.reset}`);
            }
          }
        }

        // Summary
        const passed = results.filter((r) => r.errors.length === 0).length;
        const failed = results.filter((r) => r.errors.length > 0).length;

        console.log("");
        if (totalErrors === 0) {
          console.log(
            `${c.green}${c.bold}All checks passed!${c.reset} ${c.gray}(${passed} checks)${c.reset}\n`
          );
        } else {
          console.log(
            `${c.red}${c.bold}${failed} check(s) failed${c.reset} ${c.gray}(${totalErrors} errors)${c.reset}\n`
          );

          if (failOnError) {
            throw new Error(`Build checks failed with ${totalErrors} error(s)`);
          }
        }
      },
    },
  };
}

