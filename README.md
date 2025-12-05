# Affiliate.fm Website Core Template

The foundational template for Affiliate.fm websites. This is not a starter you fork once and forget — it's a living core that powers your site while letting you pull updates without touching your content.

## Philosophy

Your site is built on top of this template. When we improve the core — fix bugs, add features, optimize performance — you can pull those changes seamlessly. Your content, configuration, and assets remain untouched.

**Template updates flow in. Your content stays yours.**

## Features

- **Updatable Core** — Pull template improvements without losing your work
- **i18n Ready** — Built-in internationalization with locale-aware structure
- **Flexible Scale** — Works as a single-page landing or a full multi-language site
- **Astro Powered** — Fast, modern, content-focused architecture

## Getting Started

```bash
# Initialize a new site from the template
npx create-astro@latest -- --template affiliatefm/website-core-template

# Or clone directly
git clone https://github.com/affiliatefm/website-core-template.git my-site
cd my-site
npm install
npm run dev
```

## Project Structure

```
src/
├── content/          # Your content (preserved during updates)
├── config/
│   ├── site.ts       # Your site settings (preserved)
│   └── locales.ts    # Your locale config (preserved)
└── ...               # Core template files (updatable)

public/
├── img/              # Your images (preserved)
└── favicon.*         # Your favicon (preserved)
```

## Updating the Core

Pull the latest template improvements while keeping your content intact:

```bash
make update-template
```

Review changes with `git status` and resolve any conflicts before committing.

### What Gets Updated

- Components, layouts, and utilities
- Base styles and theme
- Build configuration and scripts
- Dependencies and tooling

### What Stays Yours

- `src/content/` — All your pages and posts
- `src/config/site.ts` — Site configuration
- `src/config/locales.ts` — Language settings
- `public/img/` — Your images and media
- `public/favicon*` — Your branding
- `.env` files — Your secrets and environment

## i18n Architecture

The template is designed with internationalization as a first-class concern:

- Locale-based content organization (`src/content/{locale}/`)
- URL path prefixes per language
- Shared components with translation support
- Single-locale sites work perfectly — adding languages later is seamless

## Related

- [astro-content-ai-translator](https://github.com/affiliatefm/astro-content-ai-translator) — AI-powered translation for your content

## License

MIT
