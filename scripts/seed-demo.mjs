#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const templateRoot = path.join(root, "templates", "demo");

const directories = [
  { from: path.join(templateRoot, "content"), to: path.join(root, "src", "content") },
  { from: path.join(templateRoot, "data"), to: path.join(root, "src", "data") },
  { from: path.join(templateRoot, "lib"), to: path.join(root, "src", "lib") },
];

const files = [
  { from: path.join(templateRoot, "config", "site.ts"), to: path.join(root, "src", "config", "site.ts") },
];

console.log("This will overwrite your current content/data/config with the Affiliate.FM demo snapshot.\n" +
  "Make sure you've committed any work-in-progress before continuing.\n");

for (const dir of directories) {
  await fs.rm(dir.to, { recursive: true, force: true });
  await fs.mkdir(path.dirname(dir.to), { recursive: true });
  await fs.cp(dir.from, dir.to, { recursive: true });
}

for (const file of files) {
  await fs.mkdir(path.dirname(file.to), { recursive: true });
  await fs.copyFile(file.from, file.to);
}

console.log("Demo content applied. Run 'make dev' to explore the full example.");
