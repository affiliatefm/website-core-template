# Affiliate.fm Website Starter

A flexible, i18n-ready Astro starter template for building affiliate websites. Works seamlessly as a single-page landing or a full multi-page, multi-language site.

## Features

- **Single or Multi-Page** — Start with a simple one-pager and scale to a full content site
- **i18n Ready** — Built-in internationalization support with locale-aware file structure
- **Easy Updates** — Pull template improvements without overwriting your content
- **Astro Powered** — Fast, modern, content-focused architecture

## Quick Start

```bash
# Clone or init via Astro
npx create-astro@latest -- --template affiliatefm/website-starter

# Or clone directly
git clone https://github.com/affiliatefm/website-starter.git my-site
cd my-site
npm install
npm run dev
```

## Project Structure

```
src/
├── content/          # Your content (excluded from template updates)
├── config/
│   ├── site.ts       # Site configuration (excluded from updates)
│   └── locales.ts    # Locale settings (excluded from updates)
└── ...

public/
├── img/              # Your images (excluded from updates)
└── favicon.*         # Your favicon (excluded from updates)
```

## Updating the Template

Keep your site up-to-date with the latest template improvements while preserving your content and configuration:

```bash
make update-template
```

This syncs template files while keeping your content, config, and assets untouched. Review changes with `git status` before committing.

### What Gets Updated
- Components, layouts, and utilities
- Base styles and configurations
- Build scripts and dependencies

### What Stays Yours
- `src/content/` — Your pages and posts
- `src/config/site.ts` — Site settings
- `src/config/locales.ts` — Language configuration
- `public/img/` — Your images
- Environment files and secrets

## i18n Support

The starter is designed with internationalization in mind from day one:

- Locale-based content organization
- URL path prefixes per language
- Shared components with translation support
- Works with a single locale or many

Even single-language sites benefit from this structure — adding languages later is seamless.

## License

MIT


