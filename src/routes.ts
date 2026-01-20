import type { CollectionEntry } from "astro:content";
import { defaultLanguage, type LanguageCode } from "@/config/site";
import type { PageType } from "@/templates/types";

export type RouteVariantContext = {
  entry: CollectionEntry<"pages">;
  language: LanguageCode;
  slug: string;
  idPath: string;
  pageType: PageType;
  allPages: CollectionEntry<"pages">[];
};

export type RouteVariant = {
  id: string;
  prefix: string;
  template: string;
  match?: (context: RouteVariantContext) => boolean;
  pageType?: PageType | ((context: RouteVariantContext) => PageType);
  buildSlug?: (context: RouteVariantContext) => string;
  layoutProps?: (context: RouteVariantContext) => Record<string, unknown>;
  pageProps?: (context: RouteVariantContext) => Record<string, unknown>;
};

export type ResolvedRouteVariant = {
  id: string;
  slug: string;
  template: string;
  pageType: PageType;
  layoutProps?: Record<string, unknown>;
  pageProps?: Record<string, unknown>;
};

const normalizePath = (value: string): string =>
  value.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");

const joinPath = (...parts: (string | undefined)[]) =>
  parts.filter((part) => part && part.length > 0).join("/");

const normalizeId = (value: string): string => value.trim().toLowerCase();

const resolvePageType = (
  variant: RouteVariant,
  context: RouteVariantContext
): PageType => {
  if (typeof variant.pageType === "function") {
    return variant.pageType(context);
  }
  return variant.pageType ?? context.pageType;
};

const buildDefaultSlug = (prefix: string, context: RouteVariantContext): string => {
  const normalizedPrefix = normalizePath(prefix);
  if (!normalizedPrefix) {
    throw new Error("Route variant prefix cannot be empty.");
  }

  if (context.language === defaultLanguage) {
    return joinPath(normalizedPrefix, context.slug);
  }
  return joinPath(normalizedPrefix, context.language, context.slug);
};

export function resolveRouteVariants(
  variants: RouteVariant[],
  context: RouteVariantContext
): ResolvedRouteVariant[] {
  if (!Array.isArray(variants) || variants.length === 0) return [];

  return variants.flatMap((variant) => {
    if (!variant) return [];

    const id = normalizeId(variant.id ?? "");
    if (!id) {
      throw new Error("Route variant requires a non-empty id.");
    }

    const template = normalizeId(variant.template ?? "");
    if (!template) {
      throw new Error(`Route variant "${id}" requires a template id.`);
    }

    const isMatch = variant.match ? variant.match(context) : true;
    if (!isMatch) return [];

    const rawSlug = variant.buildSlug
      ? variant.buildSlug(context)
      : buildDefaultSlug(variant.prefix, context);
    const slug = normalizePath(rawSlug);
    if (!slug) {
      throw new Error(`Route variant "${id}" resolved to an empty slug.`);
    }

    const pageType = resolvePageType(variant, context);
    const layoutProps = variant.layoutProps ? variant.layoutProps(context) : undefined;
    const pageProps = variant.pageProps ? variant.pageProps(context) : undefined;

    return [
      {
        id,
        slug,
        template,
        pageType,
        layoutProps,
        pageProps,
      },
    ];
  });
}
