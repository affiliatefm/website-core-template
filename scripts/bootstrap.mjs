#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const configPath = path.join(root, "affiliatefm.core.json");
const templatePath = path.join(root, "affiliatefm.core.template.json");
const pkg = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
const currentVersion = pkg.version;

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirectory(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function ensureConfig() {
  const templateExists = await fileExists(templatePath);
  const defaultConfig = templateExists
    ? JSON.parse(await fs.readFile(templatePath, "utf8"))
    : {
        coreRepo: "affiliatefm/website-core-template",
        coreVersion: currentVersion,
        protectedPaths: ["src/content", "src/data", "public"],
        corePaths: [
          ".gitignore",
          ".jsbeautifyrc",
          ".prettierrc",
          "Makefile",
          "package.json",
          "tsconfig.json",
          "astro.config.mjs",
          "README.md",
          "scripts",
          "src/components",
          "src/config",
          "src/i18n",
          "src/integrations",
          "src/layouts",
          "src/pages"
        ]
      };

  if (!(await fileExists(configPath))) {
    await fs.writeFile(
      configPath,
      JSON.stringify({ ...defaultConfig, coreVersion: currentVersion }, null, 2) + "\n"
    );
    return { created: true };
  }

  const config = JSON.parse(await fs.readFile(configPath, "utf8"));
  config.coreVersion = currentVersion;
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n");
  return { created: false };
}

await ensureDirectory(path.join(root, ".affiliatefm"));
await ensureDirectory(path.join(root, "src/data"));

const result = await ensureConfig();
const action = result.created ? "created" : "updated";

console.log(`affiliatefm.core.json ${action}. Protected paths stay untouched during make update.`);
console.log(`Current template version: ${currentVersion}`);
console.log("Seed sample metrics with `make seed` whenever you need demo data.");
