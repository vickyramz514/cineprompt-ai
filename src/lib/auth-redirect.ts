/**
 * Safe post-auth redirects (prevent open redirects).
 */

const ALLOWED_PREFIXES = [
  "/dashboard",
  "/pricing",
  "/docs",
  "/sdk",
  "/backtesting",
  "/portfolio",
  "/blog",
  "/about",
  "/status",
] as const;

export function getSafeAuthRedirect(
  raw: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (!raw) return fallback;
  let path = raw.trim();
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      const u = new URL(path);
      path = `${u.pathname}${u.search}`;
    }
  } catch {
    return fallback;
  }
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  if (ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`) || path.startsWith(`${p}?`))) {
    return path;
  }
  return fallback;
}

export function readRedirectFromSearch(search: string): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return getSafeAuthRedirect(params.get("redirect"));
}
