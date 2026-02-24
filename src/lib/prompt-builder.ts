/**
 * Smart prompt builder - converts form inputs to AI prompt
 */

import type { Template } from "./template-schema";

export function buildPromptFromTemplate(
  template: Template,
  formValues: Record<string, string | number>
): string {
  let prompt = template.promptTemplate;

  template.inputFields.forEach((field) => {
    const value = formValues[field.key] ?? "";
    const placeholder = `{{${field.promptVariable}}}`;
    prompt = prompt.replace(new RegExp(placeholder, "g"), String(value));
  });

  return prompt.replace(/\{\{[^}]+\}\}/g, "").trim();
}
