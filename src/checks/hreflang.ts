/**
 * Hreflang Checks
 * ================
 * Validates hreflang/alternates consistency.
 */

import { getLocaleFromId, getUrlSlug } from "@/i18n";
import type { PageEntry, CheckConfig } from "./types";

const isExternal = (v: string) =>
  v.startsWith("http://") || v.startsWith("https://");

/**
 * Validates that hreflang links are bidirectional.
 * If page A links to page B, page B must link back to A.
 */
export const bidirectionalLinks: CheckConfig = {
  name: "hreflang-bidirectional",
  run: (pages) => {
    const errors: ReturnType<CheckConfig["run"]> = [];

    for (const entry of pages) {
      if (!entry.data.alternates) continue;

      const entryLocale = getLocaleFromId(entry.id);
      const entrySlug = getUrlSlug(entry);

      for (const [targetLocale, targetValue] of Object.entries(
        entry.data.alternates
      )) {
        // Skip external URLs
        if (isExternal(targetValue)) continue;

        // Skip self-references
        if (targetLocale === entryLocale) continue;

        const targetSlug = targetValue.replace(/^\//, "");

        // Find the target page
        const targetPage = pages.find(
          (p) =>
            getLocaleFromId(p.id) === targetLocale && getUrlSlug(p) === targetSlug
        );

        if (!targetPage) continue;

        // Check if target links back
        const targetAlternates = targetPage.data.alternates;
        if (!targetAlternates) {
          errors.push({
            check: "hreflang-bidirectional",
            message: `"${entry.id}" → "${targetLocale}:${targetSlug}" but "${targetPage.id}" has no alternates`,
            file: entry.id,
          });
          continue;
        }

        const backLink = targetAlternates[entryLocale];
        if (backLink === undefined) {
          errors.push({
            check: "hreflang-bidirectional",
            message: `"${entry.id}" → "${targetLocale}:${targetSlug}" but "${targetPage.id}" doesn't link back to "${entryLocale}"`,
            file: entry.id,
          });
          continue;
        }

        // Verify back link points to correct slug
        const backSlug = backLink.replace(/^\//, "");
        if (backSlug !== entrySlug && !isExternal(backLink)) {
          errors.push({
            check: "hreflang-bidirectional",
            message: `"${entry.id}" → "${targetLocale}:${targetSlug}" but "${targetPage.id}" links to "${entryLocale}:${backSlug}" instead of "${entrySlug}"`,
            file: entry.id,
          });
        }
      }
    }

    return errors;
  },
};

/**
 * Validates that linked pages have consistent external alternates.
 * If pages are linked, they must all have the same set of external URLs.
 */
export const consistentExternals: CheckConfig = {
  name: "hreflang-consistent-externals",
  run: (pages) => {
    const errors: ReturnType<CheckConfig["run"]> = [];

    // Helper to get sorted external alternates as string for comparison
    const getExternalSet = (
      alts: Record<string, string> | undefined
    ): string => {
      if (!alts) return "";
      return Object.entries(alts)
        .filter(([_, v]) => isExternal(v))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}:${v}`)
        .join("|");
    };

    // Track which pages we've already checked (avoid duplicate errors)
    const checkedPairs = new Set<string>();

    for (const entry of pages) {
      if (!entry.data.alternates) continue;

      const entryExternals = getExternalSet(entry.data.alternates);
      if (!entryExternals) continue;

      for (const [targetLocale, targetValue] of Object.entries(
        entry.data.alternates
      )) {
        if (isExternal(targetValue)) continue;

        const targetSlug = targetValue.replace(/^\//, "");
        const targetPage = pages.find(
          (p) =>
            getLocaleFromId(p.id) === targetLocale && getUrlSlug(p) === targetSlug
        );

        if (!targetPage) continue;

        const pairKey = [entry.id, targetPage.id].sort().join("↔");
        if (checkedPairs.has(pairKey)) continue;
        checkedPairs.add(pairKey);

        const targetExternals = getExternalSet(targetPage.data.alternates);

        if (entryExternals !== targetExternals) {
          errors.push({
            check: "hreflang-consistent-externals",
            message: `"${entry.id}" and "${targetPage.id}" have different external alternates`,
            file: entry.id,
          });
        }
      }
    }

    return errors;
  },
};
