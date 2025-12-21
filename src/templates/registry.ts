import { affiliateTemplate } from "./affiliate/template";
import type { TemplateDefinition } from "./types";

export const templateRegistry = [affiliateTemplate] as const satisfies TemplateDefinition[];

export type TemplateId = (typeof templateRegistry)[number]["id"];
export type TemplatePageId = (typeof templateRegistry)[number]["pages"][number]["id"];
export type TemplateStyleId = (typeof templateRegistry)[number]["styles"][number]["id"];
