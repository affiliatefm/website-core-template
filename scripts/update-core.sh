#!/usr/bin/env bash
# Update core from upstream, preserve user data (content/, data/, templates/_*, public/, package name)
set -euo pipefail

REPO="affiliatefm/website-core-template"
TEMP=$(mktemp -d)
trap "rm -rf $TEMP" EXIT

[[ ! -f "astro.config.mjs" ]] && echo "Not a valid project" && exit 1

echo "Fetching latest..."
git clone --depth 1 "https://github.com/$REPO.git" "$TEMP" 2>/dev/null

# Backup user data
mkdir -p "$TEMP/_user"
[[ -d "src/content" ]] && cp -r src/content "$TEMP/_user/"
[[ -d "src/data" ]] && cp -r src/data "$TEMP/_user/"
if [[ -d "src/templates" ]]; then
  mkdir -p "$TEMP/_user/templates"
  for dir in src/templates/_*; do
    [[ -d "$dir" ]] || continue
    cp -r "$dir" "$TEMP/_user/templates/"
  done
fi
[[ -d "public" ]] && cp -r public "$TEMP/_user/"
cp package.json "$TEMP/_user/"

# Copy core files
rm -rf src
cp -r "$TEMP/src" .
cp "$TEMP/astro.config.mjs" .
cp "$TEMP/tsconfig.json" .
cp "$TEMP/Makefile" .
[[ -f "$TEMP/.prettierrc" ]] && cp "$TEMP/.prettierrc" .
[[ -f "$TEMP/.jsbeautifyrc" ]] && cp "$TEMP/.jsbeautifyrc" .
[[ -f "$TEMP/AGENTS.md" ]] && cp "$TEMP/AGENTS.md" .
[[ -f "$TEMP/CLAUDE.md" ]] && cp "$TEMP/CLAUDE.md" .
[[ -f "$TEMP/.cursorrules" ]] && cp "$TEMP/.cursorrules" .
if [[ -f "$TEMP/.github/copilot-instructions.md" ]]; then
  mkdir -p .github
  cp "$TEMP/.github/copilot-instructions.md" .github/
fi

# Merge package.json (keep user name and extra deps, update core deps)
TEMP_DIR="$TEMP" node <<'NODE'
const fs = require('fs');
const path = require('path');

const temp = process.env.TEMP_DIR;
const user = JSON.parse(
  fs.readFileSync(path.join(temp, '_user', 'package.json'))
);
const core = JSON.parse(fs.readFileSync(path.join(temp, 'package.json')));
const merged = {
  ...core,
  name: user.name,
  homepage: user.homepage || core.homepage,
  repository: user.repository || core.repository,
  dependencies: { ...core.dependencies, ...user.dependencies },
  devDependencies: { ...core.devDependencies, ...user.devDependencies },
};
// User deps override core deps (user knows better for their project)
fs.writeFileSync('package.json', JSON.stringify(merged, null, 2) + '\n');
NODE

# Restore user data
[[ -d "$TEMP/_user/content" ]] && rm -rf src/content && cp -r "$TEMP/_user/content" src/
if [[ -d "$TEMP/_user/data" ]]; then
  mkdir -p src/data
  cp -r "$TEMP/_user/data/." src/data/
fi
if [[ -d "$TEMP/_user/templates" ]]; then
  mkdir -p src/templates
  for dir in "$TEMP/_user/templates"/_*; do
    [[ -d "$dir" ]] || continue
    rm -rf "src/templates/$(basename "$dir")"
    cp -r "$dir" "src/templates/"
  done
fi
[[ -d "$TEMP/_user/public" ]] && rm -rf public && cp -r "$TEMP/_user/public" .

npm install --silent 2>/dev/null || npm install

# Copy scripts last (this script is running, must be after all other operations)
cp -r "$TEMP/scripts" .

echo "Done. Run 'make dev' to test."
