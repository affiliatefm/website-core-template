import { template as siteTemplate } from "@/data/site";
import type { PageType } from "./types";

type ModuleLoader<T = unknown> = () => Promise<T>;

const normalizeId = (value: string) => value.trim().toLowerCase();

const layoutModules = import.meta.glob("./*/layout.astro");
const pageModules = import.meta.glob("./*/pages/*.astro");

const layoutLoaders = new Map<string, ModuleLoader>();
for (const [path, loader] of Object.entries(layoutModules)) {
  const match = path.match(/^\.\/([^/]+)\/layout\.astro$/);
  if (!match) continue;
  layoutLoaders.set(normalizeId(match[1]), loader as ModuleLoader);
}

const pageLoaders = new Map<string, Map<string, ModuleLoader>>();
for (const [path, loader] of Object.entries(pageModules)) {
  const match = path.match(/^\.\/([^/]+)\/pages\/([^/]+)\.astro$/);
  if (!match) continue;
  const [, templateId, pageName] = match;
  const templateKey = normalizeId(templateId);
  const pageId = normalizeId(pageName);
  if (!pageLoaders.has(templateKey)) {
    pageLoaders.set(templateKey, new Map());
  }
  pageLoaders.get(templateKey)!.set(pageId, loader as ModuleLoader);
}

const DEFAULT_PAGE_ID: PageType = "article";

const resolveTemplateId = (templateId?: string): string => {
  const normalized = normalizeId(templateId ?? siteTemplate);
  if (!layoutLoaders.has(normalized)) {
    const available = [...layoutLoaders.keys()].sort().join(", ");
    throw new Error(
      `Unknown template "${templateId ?? siteTemplate}". ` +
        `Available templates: ${available || "(none)"}.`
    );
  }
  return normalized;
};

const resolvePageLoader = (templateId: string, pageId: PageType): ModuleLoader => {
  const pages = pageLoaders.get(templateId);
  if (!pages || pages.size === 0) {
    throw new Error(`Template "${templateId}" has no page templates.`);
  }

  const normalized = normalizeId(pageId);
  const loader = pages.get(normalized) ?? pages.get(DEFAULT_PAGE_ID);
  if (!loader) {
    const available = [...pages.keys()].sort().join(", ");
    throw new Error(
      `Template "${templateId}" doesn't provide page "${pageId}". ` +
        `Available pages: ${available || "(none)"}.`
    );
  }
  return loader;
};

export function getTemplateId(): string {
  return resolveTemplateId();
}

export async function loadTemplateLayout(templateId?: string) {
  const resolved = resolveTemplateId(templateId);
  const loader = layoutLoaders.get(resolved)!;
  const module = (await loader()) as { default: unknown };
  return module.default;
}

export async function loadTemplatePage(pageId: PageType, templateId?: string) {
  const resolved = resolveTemplateId(templateId);
  const loader = resolvePageLoader(resolved, pageId);
  const module = (await loader()) as { default: unknown };
  return module.default;
}
