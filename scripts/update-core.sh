#!/usr/bin/env bash
# Update core from upstream, preserve user data (content/, data/, public/, package name)
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
[[ -d "public" ]] && cp -r public "$TEMP/_user/"
cp package.json "$TEMP/_user/"

# Copy core files (astro.config.mjs is user-managed, not updated)
rm -rf src
cp -r "$TEMP/src" .
cp -r "$TEMP/scripts" .
cp "$TEMP/tsconfig.json" .
cp "$TEMP/Makefile" .
[[ -f "$TEMP/.prettierrc" ]] && cp "$TEMP/.prettierrc" .
[[ -f "$TEMP/.jsbeautifyrc" ]] && cp "$TEMP/.jsbeautifyrc" .

# Merge package.json (keep user name, update deps)
node -e "
const fs = require('fs');
const user = JSON.parse(fs.readFileSync('$TEMP/_user/package.json'));
const core = JSON.parse(fs.readFileSync('$TEMP/package.json'));
const merged = { ...core, name: user.name };
fs.writeFileSync('package.json', JSON.stringify(merged, null, 2));
"

# Restore user data
[[ -d "$TEMP/_user/content" ]] && rm -rf src/content && cp -r "$TEMP/_user/content" src/
[[ -d "$TEMP/_user/data" ]] && rm -rf src/data && cp -r "$TEMP/_user/data" src/
[[ -d "$TEMP/_user/public" ]] && rm -rf public && cp -r "$TEMP/_user/public" .

npm install --silent 2>/dev/null || npm install

echo "Done. Run 'make dev' to test."
