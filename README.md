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
├── components/global/ # Shared components (head/body)
├── content/pages/     # ✏️ Your content (MDX files)
│   ├── index.mdx      #    Homepage
│   ├── docs.mdx       #    Documentation
│   ├── _collections/  #    Collection items (product pages)
│   │   ├── software/
│   │   │   └── ai-translator.mdx
│   │   └── websites/
│   │       └── ssg-directory.mdx
│   ├── software/      #    Collection landing page
│   │   └── index.mdx
│   └── websites/      #    Collection landing page
│       └── index.mdx
│   └── ru/            #    Russian content
│       └── index.mdx
├── data/              # ✏️ Your configuration
│   ├── site.ts        #    Site URL, locales, template selection
│   └── ui.ts          #    UI translations
├── config/            #    Runtime config (auto-generated)
├── i18n/              #    URL helpers
├── integrations/      #    Build checks
├── templates/affiliate/ # Core template
└── pages/             #    Astro router
```

**Your files** (✏️) — edit freely, preserved by updates  
**Core files** — updated via `make update`

## Setup

### 1. Configure site

Edit `src/data/site.ts`:

```typescript
export const siteUrl = "https://your-domain.com";
export const locales = ["en", "ru"] as const;
export const defaultLocale = "en";

export const template = "affiliate" as const;
```

### 2. Add UI strings

Edit `src/data/ui.ts`:

```typescript
export const uiStrings = {
  en: { siteName: "My Site", homeLabel: "Home" },
  ru: { siteName: "Мой сайт", homeLabel: "Главная" },
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

## Templates

Templates are convention-based folders in `src/templates/`:

- Core templates: `src/templates/<id>/` (updated by `make update`)
- User templates: `src/templates/_<id>/` (preserved by `make update`)

- `layout.astro` — site layout (imports `styles.css` if needed)
- `pages/home.astro`, `pages/article.astro`, `pages/product.astro`
- `styles.css` — optional template stylesheet
- `i18n.ts` — optional template strings
- `components/` — optional template components

Template id is the folder name (use lowercase).
User templates keep the leading underscore in `src/data/site.ts`.

Page selection logic:
- Homepage (`index.mdx`) → `Home`
- `_collections` items → `Product` (or override via `collections[].page`)
- Everything else → `Article`
- Per-page override: `page` in frontmatter

## Multilingual

### Same slugs (automatic linking)

```
pages/about.mdx      → /about/
pages/ru/about.mdx   → /ru/about/
```

Hreflang links generated automatically.

## Frontmatter

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title (required) |
| `description` | string | Meta description |
| `updatedAt` | date | For sitemap |
| `draft` | boolean | Exclude from build |
| `link` | string | External URL (product pages) |
| `pros` | string[] | Pros list (product pages) |
| `cons` | string[] | Cons list (product pages) |
| `page` | string | Page template override ("home", "article", "product") |

## Updating

```bash
# Check what would change
make update-check

# Apply update
make update
```

**Preserved:** `src/content/`, `src/data/`, `src/templates/_*`, `public/`  
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

## Related

- [astro-content-ai-translator](https://affiliate.fm/tools/astro-content-ai-translator/) — AI-powered translation for Astro. Auto-generates localized content from your content/ directory.
- [astro-content-ai-enhancer](https://affiliate.fm/tools/astro-content-ai-enhancer/) — AI assistant that turns raw Markdown into structured, well-formatted pages while keeping the original voice.

## Author

[Affiliate.FM](https://affiliate.fm) — independent media and open-source tools for affiliate, performance, and digital marketing.

## License

MIT
