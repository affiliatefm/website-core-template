# Astro i18n Starter (Minimal)

Ultra-minimal Astro 5 boilerplate for multilingual sites. All wiring is done for
you — add content and edit a few data files, nothing else.

## What you get

- **Data-only config** – user-facing settings live in `src/data/`.
- **Single MDX collection** – every file under `src/content/pages/` is a route.
- **Built-in i18n routing** – canonical URLs, hreflang, sitemap, robots.
- **Integrity checks** – build fails if hreflang links are inconsistent.
- **No demo clutter** – only one MDX page and one default layout.

## Quick start

```bash
npm install
npm run dev
```

## Project structure

```
src/
├── config/               # Runtime config using the data layer (no edits needed)
│   └── site.ts
├── content/
│   └── pages/            # Your MDX content (index.mdx is the only example)
├── data/                 # The files you edit
│   ├── site.ts           # Site URL + default language
│   └── ui.ts             # Language strings (only the Home label)
├── i18n/                 # URL helpers & translation utilities
├── integrations/         # Build-time checks (hreflang integrity)
├── layouts/              # Default layout (imported via #layout alias)
└── pages/                # Astro routes (router, 404, sitemap, robots)
```

## Editing data

Only touch the files under `src/data/`:

| File | Fields |
| --- | --- |
| `site.ts` | `siteUrl` (canonical origin) and `defaultLanguage` (the language served from the root URLs). |
| `ui.ts` | Per-language UI strings. Currently only `homeLabel` is needed. |

Example UI file:

```ts
export const uiStrings = {
  en: { homeLabel: "Home" },
  "en-US": { homeLabel: "Home" },
};
```

## Declaring languages

- Set `defaultLanguage` once in `src/data/site.ts` (e.g., `"en"`).
- Place the default language content directly under `src/content/pages/` (subfolders like `docs/` are fine).
- Create subfolders named after BCP 47 codes for every additional language: `src/content/pages/ru/`, `src/content/pages/ja/`, `src/content/pages/en-US/`, etc.
- Avoid using 2–3 letter folder names for non-language sections to prevent conflicts with language detection.

Once a folder exists, the language is automatically exposed to Astro's `i18n` config. No frontmatter fields are required.

## Adding content

MDX files in `src/content/pages/` correspond to routes. To add a language, create a
folder named after the language code and duplicate pages inside it.

```
src/content/pages/
├── index.mdx       → /
└── ru/
    └── index.mdx   → /ru/
```

Frontmatter example (matches the included `index.mdx`):

```yaml
---
title: Starter
alternates:
  en: ""
  en-US: ""
  ja: https://ja.example.com/   # Example external alternate
_translateTo: all
---
```

`alternates` explicitly links translations (including off-site URLs). `_translateTo`
is optional and is only read by the AI translation integration.

## Layout

The `#layout` alias always points to `src/layouts/basic/Layout.astro`. If you need
a custom layout, duplicate that file and change `layoutPath` in `src/config/site.ts`.
Every page automatically receives canonical/hreflang tags and the localized Home
link, so you stay focused on Markdown/MDX content.

## Commands

- `npm run dev` – start dev server
- `npm run build` – production build + HTML formatting + integrity checks
- `npm run preview` – preview the build

## License

MIT
