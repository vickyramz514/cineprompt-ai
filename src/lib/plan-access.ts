/**
 * Free vs paid dashboard features & API paths (mirrors backend planAccess.js).
 */

export type PlanFeature =
  | "batch-prices"
  | "etf-list"
  | "etf-detail"
  | "options"
  | "insiders"
  | "darkpool"
  | "economy"
  | "market-screener";

/** Features included on the free plan */
export const FREE_PLAN_FEATURES: PlanFeature[] = ["batch-prices", "etf-list"];

/** DataCaptain API paths allowed on free (for explorer) */
export const FREE_API_PATHS = new Set([
  "/developer/usage",
  "/market/status",
  "/market/earnings-calendar",
  "/stocks/prices",
  "/etf/list",
]);

/** Mirrors backend FREE_API_PATH_PATTERNS */
const FREE_API_PATH_PATTERNS = [/^\/stocks\/[A-Za-z0-9.-]+\/snapshot$/];

export const PAID_PLAN_SLUGS = new Set([
  "starter",
  "creator",
  "pro",
  "ultra",
  "enterprise",
]);

export function normalizePlan(plan?: string | null): string {
  return String(plan || "free")
    .toLowerCase()
    .trim();
}

export function isFreePlan(plan?: string | null): boolean {
  const slug = normalizePlan(plan);
  if (slug === "free") return true;
  return !PAID_PLAN_SLUGS.has(slug);
}

export function hasFeatureAccess(plan: string | null | undefined, feature: PlanFeature): boolean {
  if (!isFreePlan(plan)) return true;
  return FREE_PLAN_FEATURES.includes(feature);
}

export function isApiPathFree(path: string): boolean {
  const normalized = path.split("?")[0];
  if (FREE_API_PATHS.has(normalized)) return true;
  return FREE_API_PATH_PATTERNS.some((re) => re.test(normalized));
}

export function planDisplayName(plan?: string | null): string {
  const slug = normalizePlan(plan);
  if (slug === "free") return "Free";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/** Map dashboard routes to plan features */
export function featureForPath(pathname: string): PlanFeature | null {
  if (pathname.startsWith("/dashboard/tools/prices")) return "batch-prices";
  if (pathname === "/dashboard/etf") return "etf-list";
  if (pathname.startsWith("/dashboard/etf/")) return "etf-detail";
  if (pathname.startsWith("/dashboard/options")) return "options";
  if (pathname.startsWith("/dashboard/insiders")) return "insiders";
  if (pathname.startsWith("/dashboard/darkpool")) return "darkpool";
  if (pathname.startsWith("/dashboard/economy")) return "economy";
  return null;
}

export function isPathPremiumLocked(pathname: string, plan?: string | null): boolean {
  const feature = featureForPath(pathname);
  if (!feature) return false;
  return !hasFeatureAccess(plan, feature);
}
