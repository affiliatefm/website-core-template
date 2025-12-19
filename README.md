# Affiliate.FM Website Core Template

Independent media meets open-source tooling. This repository is the exact Astro 5 core we use to ship multilingual, data-heavy affiliate and performance marketing sites. It stays static, embraces Astro conventions, and bakes in an upgrade story so your editorial and data layers never get overwritten.

## Highlights

- **Drops right into `npm create astro@latest`** – the template build stays static and deploys anywhere.
- **Astro-native i18n** – folder-based locales, helpers for alternate URLs, optional per-locale domains, robots/sitemap routes.
- **Core vs. user layers** – `affiliatefm.core.json` captures which paths the updater may touch. `src/content/`, `src/data/`, and whatever you add to `protectedPaths` remain yours.
- **Tooling for every skill level** – Makefile targets (`make dev`, `make update`, etc.), npm scripts, and bootstrap/update helpers with human-readable logging.
- **Data workflows** – JSON under `src/data/`, TypeScript helpers in `@/lib/data`, and demo components (e.g., `<DataShowcase />`) so you can surface KPIs next to MDX narratives.
- **Translator-friendly** – ships with `@affiliate.fm/astro-content-ai-translator` so you can automate MDX drafts when you’re ready.

## Quick Start

```bash
npm create astro@latest -- --template affiliatefm/website-core-template
cd my-site
make install && make bootstrap && make seed && make dev
```

| Target | Runs | Notes |
| --- | --- | --- |
| `make install` | `npm install` | Installs dependencies |
| `make bootstrap` | `npm run bootstrap` | Writes `affiliatefm.core.json`, creates `.affiliatefm/`, prepares `src/data/` |
| `make seed` | `npm run seed:data` | Generates demo data sets in `src/data/` |
| `make dev` | `npm run dev` | Astro dev server |
| `make build` | `npm run build` | Static build + HTML prettify |
| `make preview` | `npm run preview` | Preview production build |
| `make check` | `npm run check` | `astro check` (type safety + MDX validation) |
| `make update` | `npm run update:core` | Pulls the latest Affiliate.FM core without touching protected paths |

Prefer raw npm? Every target proxies an npm script, so CI environments can stay npm native.

## Content & i18n Conventions

```
src/content/pages/
├── index.mdx              → / (default locale)
├── about.mdx              → /about
├── docs/getting-started.mdx
└── ru/
    ├── index.mdx          → /ru
    ├── o-nas.mdx          → /ru/o-nas (custom slug)
    └── insights.mdx       → /ru/insights
```

- Default locale (first item in `locales`) lives at the root.
- Other locales get their own folder. Astro’s file-based routing + the helper utilities inside `src/i18n/` auto-link versions that share a base path.
- Use `alternates` when slugs diverge. You can link to external domains too—just provide a full URL.
- Configure locales, nav items, optional per-locale domains, and active template inside `src/config/site.ts`.

```ts
export const localeDomains = {
  // ja: "https://jp.example.com", // hreflang + canonical switch to this origin
};
```

## Data Layer

- JSON files in `src/data/` are protected by default (see `affiliatefm.core.json`).
- `npm run seed:data` updates `network-opportunities.json` and `performance-insights.json` with realistic demo rows. Replace them with your own exports.
- `@/lib/data.ts` exposes helper functions. Components like `src/components/DataShowcase.astro` demonstrate how to render the metrics inside MDX.

## Keeping Core and Content in Sync

1. `make bootstrap` creates `affiliatefm.core.json` (or updates its `coreVersion`).

   ```json
   {
     "coreRepo": "affiliatefm/website-core-template",
     "protectedPaths": ["src/content", "src/data", "public"],
     "corePaths": ["astro.config.mjs", "src/layouts", "src/pages", "scripts", ...]
   }
   ```

2. Add any extra directories/files you don’t want overwritten (custom integrations, new layouts, etc.).
3. Run `make update` whenever we push a new release. The script downloads the repo via `npx giget`, copies every `corePath`, and skips anything in `protectedPaths`.
4. Inspect the diff, run `npm install` if `package.json` changed, then rebuild.

No Git? The updater works in any project because it doesn’t rely on merge strategies—it copies from a fresh download.

## Repository Layout

```
.
├── Makefile                       # Command shorthand
├── affiliatefm.core.template.json # Bootstrap template for protected paths
├── scripts/                       # bootstrap/update/seed helpers
├── src/
│   ├── components/                # Shared components (LanguageSwitcher, DataShowcase, ...)
│   ├── config/site.ts             # All site settings in one place
│   ├── content/                   # MDX content per locale
│   ├── data/                      # JSON data (safe from updates)
│   ├── i18n/                      # Helper functions & exports
│   ├── integrations/              # Build-time validations (hreflang checks)
│   ├── layouts/                   # Light & dark skins
│   └── pages/                     # Astro routes (404, catch-all, sitemap, robots)
└── tsconfig.json                  # Path aliases (@/*)
```

## AI Translation Integration

The template ships with [`@affiliate.fm/astro-content-ai-translator`](https://github.com/affiliatefm/astro-content-ai-translator). Plug in your provider credentials, run the integration, and generate draft MDX translations directly from the CLI. Because translations live alongside content collections, the usual Astro DX applies.

## Support

- Questions or ideas? Email [hello@affiliate.fm](mailto:hello@affiliate.fm).
- Bugs and feature requests? Open an issue or PR.

Build something rad. Then share it with the community so everyone can learn from it.
