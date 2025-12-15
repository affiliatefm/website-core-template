# Astro i18n Template

A production-ready, reusable template for building multilingual websites with **Astro 5**.

## Features

- **Single Config** — All site settings in one place (`src/config/site.ts`)
- **Content Collections** — Pages as MDX files with frontmatter
- **Auto-linking** — Translations matched automatically by path structure
- **Custom URLs** — Different slugs per locale when needed
- **Multi-domain** — Subdomains, ccTLDs, or external domains per locale
- **Type-safe** — Full TypeScript support
- **SEO-ready** — Sitemap, robots.txt, hreflang tags
- **Minimal** — No unnecessary dependencies

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── config/
│   └── site.ts          # ⭐ MAIN CONFIG - Edit this file!
├── content/
│   └── pages/           # 📄 Your content (MDX files)
│       ├── index.mdx           → /
│       ├── about.mdx           → /about
│       ├── docs/
│       │   └── getting-started.mdx  → /docs/getting-started
│       └── ru/                 # Russian locale
│           ├── index.mdx       → /ru
│           └── o-nas.mdx       → /ru/o-nas
├── components/          # UI components
├── layouts/             # Page layouts
├── i18n/                # i18n utilities (auto-configured)
└── pages/
    ├── [...slug].astro  # Universal router (don't edit unless advanced)
    ├── 404.astro        # Custom 404 page
    └── robots.txt.ts    # Dynamic robots.txt (uses siteUrl from config)
```

## Configuration

### Step 1: Edit Site Config

Open `src/config/site.ts` and customize:

```typescript
// 1. Set your locales
export const locales = ["en", "ru", "fr"] as const;
export const defaultLocale = "en" as const;

// 2. Set your site URL
export const siteUrl = "https://your-domain.com";

// 3. Add locale labels (for language switcher)
export const localeLabels = {
  en: "English",
  ru: "Русский",
  fr: "Français",
};

// 4. Configure UI translations and navigation
export const ui = {
  en: {
    meta: { siteName: "My Site" },
    nav: [
      { label: "Home", path: "" },
      { label: "About", path: "about" },
    ],
    ui: {
      readMore: "Read more",
      backToHome: "Back to home",
    },
  },
  ru: {
    meta: { siteName: "Мой Сайт" },
    nav: [
      { label: "Главная", path: "" },
      { label: "О нас", path: "o-nas" },
    ],
    ui: {
      readMore: "Читать далее",
      backToHome: "На главную",
    },
  },
  // ... add more locales
};
```

### Step 2: Add Content

Create MDX files in `src/content/pages/`:

**Default locale (English):**
```
src/content/pages/
├── index.mdx     → /
├── about.mdx     → /about
└── contact.mdx   → /contact
```

**Other locales:**
```
src/content/pages/ru/
├── index.mdx     → /ru
├── o-nas.mdx     → /ru/o-nas  (custom slug)
└── contact.mdx   → /ru/contact
```

### Page Frontmatter

```yaml
---
title: Page Title          # Required
description: SEO desc      # Optional
permalink: custom-slug     # Optional: override URL slug
alternates:                # Optional: link to translations with different slugs
  en: about
  ru: o-nas
draft: false               # Optional: hide from production
---
```

## How Translation Linking Works

### Automatic (by path)

Pages with the **same file path** are linked automatically:

```
src/content/pages/about.mdx       → /about
src/content/pages/ru/about.mdx    → /ru/about
```

These pages will automatically have hreflang tags pointing to each other.

### Manual (for different slugs)

When locales have different URLs, use `alternates` in frontmatter:

**English (`about.mdx`):**
```yaml
---
title: About Us
alternates:
  ru: o-nas
---
```

**Russian (`ru/o-nas.mdx`):**
```yaml
---
title: О нас
permalink: o-nas
alternates:
  en: about
---
```

## Customization

### Adding a New Locale

1. Add to `locales` array in `src/config/site.ts`
2. Add label to `localeLabels`
3. Add UI translations to `ui` object
4. Create content folder: `src/content/pages/{locale}/`

### Removing a Locale

1. Remove from `locales` array
2. Remove from `localeLabels`
3. Remove from `ui` object
4. Delete content folder (optional)

### Adding UI Strings

1. Add key to the `UIStrings` interface in `src/config/site.ts`
2. Add translations for each locale in `ui` object
3. Use in components: `const { ui } = t(locale);`

### Multi-Domain Setup

Configure different domains/subdomains per locale in `src/config/site.ts`:

```typescript
export const domains: Partial<Record<Locale, string>> = {
  // en uses default siteUrl (no entry needed)
  fr: "https://fr.example.com",     // Subdomain
  es: "https://example.es",         // Separate ccTLD
  ja: "https://partner.com/site",   // External domain with base path
};
```

**URL generation with domains:**

| Locale | Domain Config | Generated URL |
|--------|---------------|---------------|
| `en` | (default) | `https://example.com/about/` |
| `ru` | (default) | `https://example.com/ru/about/` |
| `fr` | `https://fr.example.com` | `https://fr.example.com/about/` |
| `es` | `https://example.es` | `https://example.es/about/` |

When a locale has its own domain, the locale prefix is **not** included in the path (the domain itself identifies the locale).

## SEO

### Sitemap

Sitemap is auto-generated at build time via `@astrojs/sitemap`. Output: `/sitemap-index.xml`

### Robots.txt

Auto-generated from `siteUrl` config. Edit `src/pages/robots.txt.ts` to customize rules.

### 404 Page

Custom 404 page at `src/pages/404.astro`. Automatically detects locale from URL path.

## Technical Details

### Built-in Astro i18n

This template uses Astro's [built-in i18n routing](https://docs.astro.build/en/guides/internationalization/):

```javascript
// astro.config.mjs
i18n: {
  locales: ["en", "ru", "fr"],
  defaultLocale: "en",
  routing: {
    prefixDefaultLocale: false,  // / instead of /en/
  },
}
```

### URL Structure

| Content Path | URL |
|-------------|-----|
| `pages/index.mdx` | `/` |
| `pages/about.mdx` | `/about/` |
| `pages/ru/index.mdx` | `/ru/` |
| `pages/ru/about.mdx` | `/ru/about/` |

### Helper Functions

```typescript
import { t, getLocaleFromId, getLocaleOrigin, getAbsoluteLocaleUrl } from "@/i18n";

// Get translations for locale
const ui = t("ru");
console.log(ui.nav); // Navigation items
console.log(ui.ui.readMore); // "Читать далее"

// Extract locale from content entry ID
getLocaleFromId("ru/about"); // "ru"
getLocaleFromId("about");    // "en" (default)

// Get domain for a locale (respects `domains` config)
getLocaleOrigin("fr"); // "https://fr.example.com" (if configured)
getLocaleOrigin("ru"); // "https://example.com" (default siteUrl)

// Build absolute URL for a locale
getAbsoluteLocaleUrl("fr", "about"); // "https://fr.example.com/about/"
getAbsoluteLocaleUrl("ru", "about"); // "https://example.com/ru/about/"
```

## License

MIT
