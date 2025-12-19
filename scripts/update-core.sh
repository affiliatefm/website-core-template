#!/usr/bin/env bash
# Update core from upstream, preserve user data (content/, data/, public/)
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

# Copy everything from template
rm -rf src
cp -r "$TEMP/src" .
cp -r "$TEMP/scripts" .
cp "$TEMP/astro.config.mjs" .
cp "$TEMP/tsconfig.json" .
cp "$TEMP/Makefile" .
cp "$TEMP/package.json" .
[[ -f "$TEMP/.prettierrc" ]] && cp "$TEMP/.prettierrc" .
[[ -f "$TEMP/.jsbeautifyrc" ]] && cp "$TEMP/.jsbeautifyrc" .

# Restore user data
[[ -d "$TEMP/_user/content" ]] && rm -rf src/content && cp -r "$TEMP/_user/content" src/
[[ -d "$TEMP/_user/data" ]] && rm -rf src/data && cp -r "$TEMP/_user/data" src/
[[ -d "$TEMP/_user/public" ]] && rm -rf public && cp -r "$TEMP/_user/public" .

npm install --silent 2>/dev/null || npm install

echo "Done. Run 'make dev' to test."
