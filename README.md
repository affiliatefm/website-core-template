# Astro i18n Boilerplate

Minimal, content-driven i18n boilerplate for Astro 5.

## Features

- ✅ Astro 5 built-in i18n routing
- ✅ MDX content collections
- ✅ Auto-matching translations by path
- ✅ Custom URLs per locale
- ✅ Single-locale pages support
- ✅ Nested paths
- ✅ TypeScript

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── content/pages/              # MDX content
│   ├── index.mdx               # /
│   ├── about.mdx               # /about
│   ├── contact.mdx             # /contact (EN only)
│   ├── docs/
│   │   └── getting-started.mdx # /docs/getting-started
│   └── ru/
│       ├── index.mdx           # /ru
│       ├── o-nas.mdx           # /ru/o-nas (custom URL)
│       ├── only-russian.mdx    # /ru/only-russian (RU only)
│       └── docs/
│           └── getting-started.mdx
├── pages/
│   ├── [...path].astro         # Default locale routes
│   └── [locale]/
│       └── [...path].astro     # Other locale routes
├── i18n/
│   ├── config.ts               # Locales config
│   ├── translations.ts         # UI strings + nav
│   └── utils.ts                # Helpers
├── layouts/
│   └── BaseLayout.astro
└── components/
    ├── Navigation.astro
    └── LanguageSwitcher.astro
```

## i18n Patterns

### Auto-Matched Pages

Pages with same path structure link automatically:

```
pages/about.mdx       ↔  pages/ru/about.mdx
pages/docs/guide.mdx  ↔  pages/ru/docs/guide.mdx
```

No configuration needed.

### Custom URLs

When paths must differ between locales:

**English** (`pages/about.mdx`):
```yaml
---
title: About
alternates:
  en: about
  ru: o-nas
---
```

**Russian** (`pages/ru/o-nas.mdx`):
```yaml
---
title: О нас
permalink: o-nas
alternates:
  en: about
  ru: o-nas
---
```

Result: `/about` ↔ `/ru/o-nas`

### Single-Locale Pages

Just don't create the translation. Language switcher shows it as unavailable.

## Adding Content

### New Page (Both Locales)

```
pages/services.mdx      → /services
pages/ru/services.mdx   → /ru/services
```

Auto-linked, no frontmatter needed.

### Navigation

Update `src/i18n/translations.ts`:

```ts
en: {
  nav: {
    links: [
      { path: "", label: "Home" },
      { path: "services", label: "Services" },
    ],
  },
},
ru: {
  nav: {
    links: [
      { path: "", label: "Главная" },
      { path: "services", label: "Услуги" },
    ],
  },
},
```

## Adding a Locale

1. `astro.config.mjs` — add to `locales` array
2. `src/i18n/config.ts` — add to `locales` and `localeLabels`
3. `src/i18n/translations.ts` — add UI translations
4. Create `src/content/pages/<locale>/`

## Frontmatter Reference

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title (required) |
| `description` | string | Meta description |
| `permalink` | string | Custom URL slug |
| `alternates` | object | `{ locale: slug }` mapping |
| `draft` | boolean | Exclude from build |

## License

MIT
