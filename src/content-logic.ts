import { collections } from "@/data/site";
import { selectedTemplate, type TemplatePageId } from "@/templates";

type ConfiguredCollection = (typeof collections)[number];
export type TemplateId = TemplatePageId;

export type CollectionConfig = {
  collection: string;
  slug?: string;
  template?: TemplateId;
};

export type CollectionName = ConfiguredCollection["collection"];

export type CollectionRouteInfo = {
  collection: CollectionConfig;
  itemSlug: string;
};

const normalizePath = (value: string): string =>
  value.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");

const normalizeSlug = (value?: string): string => {
  if (!value) return "";
  return normalizePath(value);
};

export const getCollectionByName = (name: CollectionName) =>
  collections.find((collection) => collection.collection === name);

export const getCollectionRouteInfo = (path: string): CollectionRouteInfo | null => {
  const normalized = normalizePath(path);
  const collectionsRoot = normalizePath("_collections");

  if (!normalized.startsWith(`${collectionsRoot}/`)) return null;

  const rest = normalized.slice(collectionsRoot.length + 1);
  if (!rest) return null;

  const [collectionName, itemSlug, ...tail] = rest.split("/");
  if (!collectionName || !itemSlug || tail.length > 0) return null;

  const configured = collections.find(
    (collection) => collection.collection === collectionName
  );

  return {
    collection: configured ?? { collection: collectionName },
    itemSlug,
  };
};

export const getCollectionItemSlug = (route: CollectionRouteInfo) => {
  const rawPrefix = route.collection.slug ?? route.collection.collection;
  const prefix = normalizeSlug(rawPrefix);
  return prefix ? `${prefix}/${route.itemSlug}` : route.itemSlug;
};

export const resolveTemplatePath = (templateId?: TemplateId): string => {
  if (selectedTemplate.pages.length === 0) {
    throw new Error(
      `Template "${selectedTemplate.id}" has no pages configured. ` +
        "Check src/templates."
    );
  }

  if (!templateId) {
    return selectedTemplate.pages[0].path;
  }

  const selected = selectedTemplate.pages.find(
    (template) => template.id === templateId
  );
  if (!selected) {
    throw new Error(
      `Unknown page template "${templateId}" for "${selectedTemplate.id}". ` +
        "Check src/templates."
    );
  }

  return selected.path;
};

export const toTemplateKey = (value: string): string => {
  const normalized = normalizePath(value).replace(/^\./, "");

  if (normalized.startsWith("/src/")) return normalized;
  if (normalized.startsWith("src/")) return `/${normalized}`;
  if (normalized.startsWith("/")) return normalized;

  return `/${normalized}`;
};
