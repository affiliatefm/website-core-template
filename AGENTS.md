# Agent Instructions

This repository is a shared core template used by many sites. `make update` replaces core files with upstream versions.

Default behavior:
- Treat core files as read-only in site repos.
- Only edit user-owned areas listed below unless the user explicitly asks to change core.
- If a change must land in the core, do not edit core files in the site repo. Instead, ask the maintainer to update `website-core-template` and then run `make update` in the site.

User-owned areas (preserved by update):
- `src/content/`
- `src/data/`
- `src/templates/_*`
- `public/`
- `package.json` (name/homepage/repository and extra deps are preserved)

Core areas (overwritten by update):
- Everything else, including `src/templates/*` without the leading `_`, `src/components/`, `src/pages/`, `scripts/`, `Makefile`, configs.

If `AGENTS.local.md` exists, follow it as a site-specific override.

When in doubt, ask before touching core files.
