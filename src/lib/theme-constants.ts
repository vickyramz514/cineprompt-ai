export const THEME_STORAGE_KEY = "dc-theme";

export type AppTheme = "dark" | "light" | "ocean";

export const THEMES: { id: AppTheme; label: string; hint: string }[] = [
  { id: "dark", label: "Dark", hint: "Default indigo night" },
  { id: "light", label: "Light", hint: "Bright workspace" },
  { id: "ocean", label: "Ocean", hint: "Teal market depth" },
];
