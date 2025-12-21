export type TemplatePage = {
  id: string;
  path: string;
};

export type TemplateStyle = {
  id: string;
  label: string;
  path: string;
};

export type TemplateDefinition = {
  id: string;
  name: string;
  layout: string;
  pages: TemplatePage[];
  styles: TemplateStyle[];
  i18n?: string;
};
