/**
 * Template & Niche schema for CinePrompt AI
 */

export type TemplateInputField = {
  id: string;
  key: string;
  label: string;
  type: "text" | "date" | "textarea" | "number";
  placeholder?: string;
  required?: boolean;
  promptVariable: string; // Maps to prompt template
};

export type Niche = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  gradient: string;
  description?: string;
};

export type Template = {
  id: string;
  name: string;
  slug: string;
  nicheId: string;
  category: string;
  description: string;
  useCases: string[];
  thumbnail: string;
  duration: number;
  style: string;
  languages: string[];
  inputFields: TemplateInputField[];
  promptTemplate: string; // e.g. "Cinematic wedding video for {{name}} on {{date}} at {{location}}. Message: {{message}}"
  creditsCost: number;
  isTrending?: boolean;
  isRecommended?: boolean;
};
