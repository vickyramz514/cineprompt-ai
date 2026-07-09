/**
 * Public site contact & trust links (override via NEXT_PUBLIC_* in production).
 */

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "support@datacaptain.com";

export const SALES_EMAIL =
  process.env.NEXT_PUBLIC_SALES_EMAIL?.trim() || "sales@datacaptain.com";

export const STATUS_PAGE_PATH = "/status";

export function mailtoSupport(subject?: string) {
  const base = `mailto:${SUPPORT_EMAIL}`;
  if (!subject) return base;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}

export function mailtoSales(subject?: string) {
  const base = `mailto:${SALES_EMAIL}`;
  if (!subject) return base;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}
