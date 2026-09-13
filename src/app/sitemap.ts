import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { getAllSeoLandingSlugs } from "@/lib/seo-landing-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/docs",
    "/sdk",
    "/pricing",
    "/backtesting",
    "/portfolio",
    "/blog",
    "/auth/signup",
    "/terms",
    "/privacy",
    "/status",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: (path === "" || path === "/docs" || path === "/pricing" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: path === "" ? 1 : path === "/about" ? 0.75 : 0.8,
  }));

  const landings = getAllSeoLandingSlugs().map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const posts = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(`${post.updatedAt}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...landings, ...posts];
}
