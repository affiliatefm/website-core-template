import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { siteUrl, defaultLanguage as defaultLanguageData } from "../data/site";
import { uiStrings } from "../data/ui";

/**
 * Runtime config consumed by the app.
 * User-facing data lives in src/data/.
 */

export { siteUrl };

const languageInfo = discoverLanguages(defaultLanguageData);

export const languages = languageInfo.languages as readonly string[];
export type LanguageCode = (typeof languages)[number];
export const defaultLanguage: LanguageCode = defaultLanguageData;

export const ui = uiStrings;
export type UIConfig = typeof uiStrings;
export type UIStrings = (typeof uiStrings)[LanguageCode];

export const layoutPath = "./src/layouts/basic/Layout.astro";

// =============================================================================
// Language discovery
// =============================================================================

function discoverLanguages(defaultLanguage: string) {
  const pagesDir = join(process.cwd(), "src", "content", "pages");
  const files = collectMdxFiles(pagesDir);

  if (files.length === 0) {
    throw new Error("No MDX files found in src/content/pages.");
  }

  const languages = new Set<string>([defaultLanguage]);
  let hasDefaultContent = false;

  for (const filePath of files) {
    const relPath = relative(pagesDir, filePath).replace(/\\/g, "/");
    const [firstSegment = ""] = relPath.split("/");
    const isNested = relPath.includes("/");

    if (!isNested) {
      hasDefaultContent = true;
      continue;
    }

    if (firstSegment === defaultLanguage) {
      throw new Error(
        `Default language "${defaultLanguage}" must be placed directly under src/content/pages/, not inside a "${defaultLanguage}/" folder.`
      );
    }

    if (looksLikeLanguageSegment(firstSegment)) {
      languages.add(firstSegment);
    } else {
      hasDefaultContent = true;
    }
  }

  if (!hasDefaultContent) {
    throw new Error(
      `No content detected for default language "${defaultLanguage}". ` +
        "Add MDX files directly under src/content/pages/ (without language prefix)."
    );
  }

  const orderedLanguages = [
    defaultLanguage,
    ...Array.from(languages).filter((lang) => lang !== defaultLanguage),
  ];

  return {
    languages: orderedLanguages,
  };
}

function collectMdxFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectMdxFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(entryPath);
    }
  }

  return files;
}

function looksLikeLanguageSegment(value: string) {
  return /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(value);
}
