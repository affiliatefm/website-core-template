import { template as siteTemplate } from "../data/site";
import { templateRegistry, type TemplateId, type TemplatePageId, type TemplateStyleId } from "./registry";
import type { TemplateDefinition, TemplateStyle } from "./types";

export { templateRegistry };
export type { TemplateDefinition } from "./types";
export type { TemplateId, TemplatePageId, TemplateStyleId } from "./registry";

const normalizeId = (value: string) => value.trim();

const resolveTemplate = (id: string): TemplateDefinition => {
  const normalized = normalizeId(id);
  const found = templateRegistry.find((template) => template.id === normalized);
  if (!found) {
    const available = templateRegistry.map((template) => template.id).join(", ");
    throw new Error(
      `Unknown template "${id}". Available templates: ${available || "(none)"}.`
    );
  }
  return found;
};

const resolveStyle = (
  template: TemplateDefinition,
  styleId?: string
): TemplateStyle => {
  if (template.styles.length === 0) {
    throw new Error(`Template "${template.id}" has no styles configured.`);
  }

  if (!styleId) {
    return template.styles[0];
  }

  const normalized = normalizeId(styleId);
  const found = template.styles.find((style) => style.id === normalized);
  if (!found) {
    const available = template.styles.map((style) => style.id).join(", ");
    throw new Error(
      `Unknown style "${styleId}" for template "${template.id}". ` +
        `Available styles: ${available || "(none)"}.`
    );
  }
  return found;
};

export const selectedTemplate = resolveTemplate(siteTemplate.id);
export const selectedTemplateStyle = resolveStyle(
  selectedTemplate,
  siteTemplate.style
);

export const templateId = selectedTemplate.id as TemplateId;
export const templateStyleId = selectedTemplateStyle.id as TemplateStyleId;
export const templateStylePath = selectedTemplateStyle.path;
export const templateLayoutPath = selectedTemplate.layout;
export const templatePages = selectedTemplate.pages;
export const templateI18nPath = selectedTemplate.i18n;
