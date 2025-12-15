/**
 * Build-time Checks
 * ==================
 * Runs all enabled checks and throws on errors.
 *
 * Usage:
 *   import { runChecks } from "@/checks";
 *   runChecks(allPages);
 *
 * Add new checks:
 *   1. Create a new file (e.g., seo.ts)
 *   2. Export CheckConfig objects
 *   3. Import and add to `checks` array below
 */

import type { PageEntry, CheckConfig, CheckError } from "./types";
import { bidirectionalLinks, consistentExternals } from "./hreflang";

// =============================================================================
// COLORS (ANSI)
// =============================================================================

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

// =============================================================================
// CHECKS REGISTRY
// =============================================================================

/**
 * All registered checks.
 * Add new checks here.
 */
const checks: CheckConfig[] = [
  // Hreflang checks
  bidirectionalLinks,
  consistentExternals,

  // Add more checks here:
  // seoMetaTags,
  // contentQuality,
  // imageAlt,
];

// =============================================================================
// RUNNER
// =============================================================================

/**
 * Run all enabled checks with colored output.
 * Throws an error if any check fails.
 */
export function runChecks(pages: PageEntry[]): void {
  const results: { name: string; errors: CheckError[]; time: number }[] = [];
  let totalErrors = 0;

  console.log(`\n${c.cyan}${c.bold}Running build checks...${c.reset}\n`);

  for (const check of checks) {
    if (check.enabled === false) continue;

    const start = performance.now();
    const errors = check.run(pages);
    const time = performance.now() - start;

    results.push({ name: check.name, errors, time });
    totalErrors += errors.length;

    if (errors.length === 0) {
      console.log(`  ${c.green}✓${c.reset} ${check.name} ${c.gray}(${time.toFixed(0)}ms)${c.reset}`);
    } else {
      console.log(`  ${c.red}✗${c.reset} ${check.name} ${c.gray}(${time.toFixed(0)}ms)${c.reset}`);
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
    console.log(`${c.green}${c.bold}All checks passed!${c.reset} ${c.gray}(${passed} checks)${c.reset}\n`);
  } else {
    console.log(
      `${c.red}${c.bold}${failed} check(s) failed${c.reset} ${c.gray}(${totalErrors} errors)${c.reset}\n`
    );
    throw new Error(`Build checks failed with ${totalErrors} error(s)`);
  }
}

/**
 * Run checks and return errors without throwing.
 * Useful for reporting or CI integration.
 */
export function getCheckErrors(pages: PageEntry[]): CheckError[] {
  const allErrors: CheckError[] = [];

  for (const check of checks) {
    if (check.enabled === false) continue;

    const errors = check.run(pages);
    allErrors.push(...errors);
  }

  return allErrors;
}

// Re-export types
export type { PageEntry, CheckConfig, CheckError } from "./types";
