# Website Core Template

Minimal Astro 5 template for multilingual static sites. Zero config to start — just add content.

Built by [Affiliate.FM](https://affiliate.fm) — independent media and open-source tools for affiliate marketing.

## Quick Start

```bash
npm create astro@latest -- --template affiliatefm/website-core-template
cd my-site
make dev
```

Open http://localhost:4321

## Project Structure

```
src/
├── content/pages/     # ✏️ Your content (MDX files)
│   ├── index.mdx      #    Homepage
│   ├── about.mdx      #    Another page
│   └── ru/            #    Russian content
│       └── index.mdx
├── data/              # ✏️ Your configuration
│   ├── site.ts        #    Site URL, default language
│   └── ui.ts          #    UI translations
├── config/            #    Runtime config (auto-generated)
├── i18n/              #    URL helpers
├── integrations/      #    Build checks
├── layouts/basic/     #    Default layout
└── pages/             #    Astro router
```

**Your files** (✏️) — edit freely, never touched by updates  
**Core files** — updated via `make update`

## Setup

### 1. Configure site

Edit `src/data/site.ts`:

```typescript
export const siteUrl = "https://your-domain.com";
export const defaultLanguage = "en";
```

### 2. Add UI strings

Edit `src/data/ui.ts`:

```typescript
export const uiStrings = {
  en: { homeLabel: "Home" },
  ru: { homeLabel: "Главная" },
} as const;
```

### 3. Create content

Add MDX files to `src/content/pages/`:

- Default language → `pages/about.mdx` → `/about/`
- Other languages → `pages/ru/about.mdx` → `/ru/about/`

## Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start dev server |
| `make build` | Build for production |
| `make preview` | Preview build |
| `make update` | Update core from upstream |

## Multilingual

### Same slugs (automatic linking)

```
pages/about.mdx      → /about/
pages/ru/about.mdx   → /ru/about/
```

Hreflang links generated automatically.

### Different slugs

```yaml
# pages/about.mdx
---
title: About
alternates:
  ru: o-nas
---

# pages/ru/o-nas.mdx
---
title: О нас
permalink: o-nas
alternates:
  en: about
---
```

### External alternates

```yaml
---
title: About
alternates:
  ja: https://ja.example.com/about/
---
```

## Frontmatter

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title (required) |
| `description` | string | Meta description |
| `permalink` | string | Custom URL slug |
| `alternates` | object | Language → slug mapping |
| `updatedAt` | date | For sitemap |
| `draft` | boolean | Exclude from build |

## Updating

```bash
# Check what would change
make update-check

# Apply update
make update
```

**Preserved:** `src/content/`, `src/data/`, `public/`  
**Updated:** everything else

## Build Checks

Automatic validation:
- ✓ Hreflang links are bidirectional
- ✓ All languages have UI strings
- ✓ No duplicate URLs

## Adding Integrations

```bash
npx astro add tailwind
npx astro add react
```

## License

MIT © [Affiliate.FM](https://affiliate.fm)
