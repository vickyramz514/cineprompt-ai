import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { BLOG_POSTS } from "@/lib/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/docs",
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
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const posts = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(`${post.updatedAt}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...posts];
}
