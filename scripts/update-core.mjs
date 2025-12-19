#!/usr/bin/env node
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const configPath = path.join(root, "affiliatefm.core.json");
const templatePath = path.join(root, "affiliatefm.core.template.json");
const tmpDir = path.join(root, ".affiliatefm", "core-latest");

const DEFAULT_PROTECTED = ["src/content", "src/data", "public"];
const DEFAULT_CORE_PATHS = [
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
];

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function readConfig() {
  if (await fileExists(configPath)) {
    return JSON.parse(await fs.readFile(configPath, "utf8"));
  }
  if (await fileExists(templatePath)) {
    return JSON.parse(await fs.readFile(templatePath, "utf8"));
  }
  return {
    coreRepo: "affiliatefm/website-core-template",
    protectedPaths: DEFAULT_PROTECTED,
    corePaths: DEFAULT_CORE_PATHS
  };
}

function normalizeList(list = []) {
  return [...list].map((item) => item.replace(/\\/g, "/").replace(/\/$/, ""));
}

function shouldSkip(target, protectedList) {
  const normalized = target.replace(/\\/g, "/");
  return protectedList.some((item) => normalized === item || normalized.startsWith(`${item}/`));
}

async function run(command, args, cwd = root) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function main() {
  const config = await readConfig();
  const coreRepo = config.coreRepo || "affiliatefm/website-core-template";
  const protectedList = normalizeList([
    ...DEFAULT_PROTECTED,
    ...(config.protectedPaths || [])
  ]);
  const corePaths = config.corePaths && config.corePaths.length > 0 ? config.corePaths : DEFAULT_CORE_PATHS;

  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(path.dirname(tmpDir), { recursive: true });

  console.log(`Fetching latest core from ${coreRepo} ...`);
  await run("npx", ["--yes", "giget@latest", coreRepo, tmpDir]);

  const summary = { updated: [], skipped: [], missing: [] };

  for (const relPath of corePaths) {
    const srcPath = path.join(tmpDir, relPath);
    const destPath = path.join(root, relPath);
    const normalized = relPath.replace(/\\/g, "/");

    if (shouldSkip(normalized, protectedList)) {
      summary.skipped.push(normalized);
      continue;
    }

    if (!(await fileExists(srcPath))) {
      summary.missing.push(normalized);
      continue;
    }

    await fs.cp(srcPath, destPath, { recursive: true });
    summary.updated.push(normalized);
  }

  // Update version marker when config exists
  if (await fileExists(configPath)) {
    const latestPkgPath = path.join(tmpDir, "package.json");
    let latestVersion = config.coreVersion;
    if (await fileExists(latestPkgPath)) {
      const pkg = JSON.parse(await fs.readFile(latestPkgPath, "utf8"));
      latestVersion = pkg.version;
    }
    const configData = JSON.parse(await fs.readFile(configPath, "utf8"));
    configData.coreVersion = latestVersion;
    await fs.writeFile(configPath, JSON.stringify(configData, null, 2) + "\n");
  }

  await fs.rm(tmpDir, { recursive: true, force: true });

  console.log("\nCore files updated:");
  for (const item of summary.updated) {
    console.log(`  ✓ ${item}`);
  }
  if (summary.skipped.length > 0) {
    console.log("\nSkipped (protected):");
    for (const item of summary.skipped) console.log(`  • ${item}`);
  }
  if (summary.missing.length > 0) {
    console.warn("\nMissing in upstream template:");
    for (const item of summary.missing) console.warn(`  ! ${item}`);
  }

  console.log("\nReview changes, run npm install if dependencies changed, then re-build your project.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
