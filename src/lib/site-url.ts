/**
 * Marketing site origin for sitemap, canonical URLs, and Open Graph.
 */

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  // Canonical URLs, robots.txt, and sitemap.xml must always use the public
  // production domain. VERCEL_URL is deployment-specific and can be protected.
  return "https://www.datacaptain.in";
}
