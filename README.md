# Astro i18n Core Template

Minimal Astro 5 template for multilingual sites. Zero config to start — just add content.

## Features

- **File-based i18n** — language detection from folder structure
- **Auto-generated sitemap** with hreflang alternate links
- **Build-time validation** — catches broken hreflang links before deploy
- **SEO-ready** — canonical URLs, robots.txt, proper meta tags
- **Single layout** — easily customizable via `#layout` alias

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:4321 — you're running!

## Project structure

```
src/
├── data/                 # ✏️ EDIT THESE FILES
│   ├── site.ts           #    Site URL + default language
│   └── ui.ts             #    UI strings per language
├── content/
│   └── pages/            # ✏️ YOUR CONTENT GOES HERE
│       ├── index.mdx     #    Default language homepage
│       ├── about.mdx     #    Default language page
│       ├── ru/           #    Russian content folder
│       │   ├── index.mdx
│       │   └── about.mdx
│       └── de/           #    German content folder
│           └── index.mdx
├── config/               # Runtime config (auto-generated from data/)
├── i18n/                 # URL helpers & translation utilities
├── integrations/         # Build-time checks
├── layouts/              # Page layouts
└── pages/                # Astro router
```

## Setup (2 minutes)

### 1. Configure your site

Edit `src/data/site.ts`:

```ts
export const siteUrl = "https://your-domain.com";
export const defaultLanguage = "en";
```

### 2. Add UI strings

Edit `src/data/ui.ts`:

```ts
export const uiStrings = {
  en: { homeLabel: "Home" },
  ru: { homeLabel: "Главная" },
  de: { homeLabel: "Startseite" },
} as const;
```

### 3. Create content

Add MDX files to `src/content/pages/`:

- Default language → directly in `pages/`
- Other languages → in subfolders like `pages/ru/`, `pages/de/`

**Frontmatter example:**

```yaml
---
title: About Us
description: Learn more about our company
---
```

## Linking translations

Translations are linked automatically when files have the same path:

```
pages/about.mdx      → /about/
pages/ru/about.mdx   → /ru/about/
```

For **different slugs**, use `alternates` in frontmatter:

```yaml
# pages/about.mdx
---
title: About
alternates:
  ru: o-nas  # Links to /ru/o-nas/
---

# pages/ru/o-nas.mdx
---
title: О нас
permalink: o-nas
alternates:
  en: about  # Links back to /about/
---
```

For **external alternates** (e.g., separate domain per language):

```yaml
---
title: About
alternates:
  ja: https://ja.example.com/about/
---
```

## Frontmatter reference

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title (required) |
| `description` | string | Meta description |
| `permalink` | string | Custom URL slug |
| `alternates` | object | Language → slug/URL mapping |
| `updatedAt` | date | Last modified (for sitemap) |
| `draft` | boolean | Exclude from build |

## Custom layout

The `#layout` alias points to `src/layouts/basic/Layout.astro`.

To customize:
1. Edit the existing layout, or
2. Create a new layout and update `layoutPath` in `src/config/site.ts`

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server at localhost:4321 |
| `npm run build` | Build for production + run integrity checks |
| `npm run preview` | Preview production build locally |

## Build checks

The template validates your build automatically:

- ✓ All hreflang links are bidirectional
- ✓ All languages have UI strings defined
- ✓ No conflicting URL slugs

If checks fail, the build stops with a clear error message.

## Adding integrations

This template works with any Astro integration:

```bash
npx astro add tailwind
npx astro add react
```

## License

MIT
