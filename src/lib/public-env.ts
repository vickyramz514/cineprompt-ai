/**
 * Public API URLs (NEXT_PUBLIC_* — inlined at `next build`).
 * Set NEXT_PUBLIC_API_BASE_URL in Vercel → Settings → Environment Variables (Production), then redeploy.
 */

function trimTrailingSlash(s: string) {
  return s.replace(/\/$/, "");
}

/** e.g. https://api.example.com/v1 — used by Axios `api` client */
export function getPublicApiBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (explicit) return trimTrailingSlash(explicit);

  const origin =
    process.env.NEXT_PUBLIC_DATACAPTAIN_URL || "http://localhost:4000";
  return `${trimTrailingSlash(origin)}/v1`;
}

/** Origin only, no /v1 or /api — DataCaptain docs & WebSocket display */
export function getPublicApiOrigin(): string {
  if (process.env.NEXT_PUBLIC_DATACAPTAIN_URL) {
    return trimTrailingSlash(process.env.NEXT_PUBLIC_DATACAPTAIN_URL);
  }
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (base) return trimTrailingSlash(base.replace(/\/(v1|api)\/?$/, ""));
  return "http://localhost:4000";
}
