import { collections, templates } from "@/data/site";

type ConfiguredCollection = (typeof collections)[number];
type ConfiguredTemplate = (typeof templates)[number];

export type TemplateId = ConfiguredTemplate["id"];

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
  if (templates.length === 0) {
    throw new Error("No templates configured. Check src/data/site.ts.");
  }

  if (!templateId) {
    return templates[0].path;
  }

  const selected = templates.find((template) => template.id === templateId);
  if (!selected) {
    throw new Error(`Unknown template "${templateId}". Check src/data/site.ts.`);
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
