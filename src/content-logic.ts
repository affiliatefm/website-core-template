import { collections } from "@/data/site";
import type { PageType } from "@/templates/types";

type ConfiguredCollection = (typeof collections)[number];

export type CollectionConfig = {
  collection: string;
  slug?: string;
  page?: PageType;
};

export type CollectionName = [ConfiguredCollection] extends [never]
  ? string
  : ConfiguredCollection["collection"];

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

const normalizePageType = (value?: string): PageType | undefined => {
  if (!value) return undefined;
  return value.trim().toLowerCase() as PageType;
};

const HOME_PAGE_ID: PageType = "home";
const DEFAULT_PAGE_ID: PageType = "article";
const COLLECTION_PAGE_ID: PageType = "product";

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

export const resolvePageType = (input: {
  idPath: string;
  data: { page?: string; permalink?: string };
}): PageType => {
  const explicit = normalizePageType(input.data.page);
  if (explicit) return explicit;

  const normalizedIdPath = normalizePath(input.idPath);
  const permalink = input.data.permalink?.trim();
  const isHome = normalizedIdPath === "index" || permalink === "/";
  if (isHome) return HOME_PAGE_ID;

  const route = getCollectionRouteInfo(normalizedIdPath);
  if (route) {
    return normalizePageType(route.collection.page) ?? COLLECTION_PAGE_ID;
  }

  return DEFAULT_PAGE_ID;
};
