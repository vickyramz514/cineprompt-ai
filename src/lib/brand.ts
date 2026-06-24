export type LogoVariant = "header" | "sidebar" | "footer" | "auth";

/** Square display size (px) — full logo image scales to fit */
export const LOGO_SIZE: Record<LogoVariant, number> = {
  sidebar: 36,
  header: 48,
  footer: 56,
  auth: 48,
};

/** Legacy chart-bar icon size (px) */
export const LOGO_ICON_SIZE: Record<LogoVariant, number> = {
  sidebar: 22,
  header: 28,
  footer: 32,
  auth: 28,
};

export const LOGO_SHOW_WORDMARK: Record<LogoVariant, boolean> = {
  sidebar: false,
  header: true,
  footer: true,
  auth: true,
};

export const LOGO_TEXT_CLASS: Record<LogoVariant, string> = {
  sidebar: "text-sm",
  header: "text-lg",
  footer: "text-xl",
  auth: "text-lg",
};

export const SITE_HEADER_OFFSET = "pt-[4.25rem]";
