import type { Metadata } from "next";
import { getSeoLandingPage } from "@/lib/seo-landing-pages";
import { getSiteUrl } from "@/lib/site-url";

export function seoLandingMetadata(slug: string): Metadata {
  const page = getSeoLandingPage(slug);
  if (!page) return { title: "Not found" };

  const url = `${getSiteUrl()}/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    keywords: [page.keyword, "Data Captain", "ETF API", "US market data"],
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: "website",
      images: [{ url: "/logo/logo.jpeg", width: 1254, height: 1254, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/logo/logo.jpeg"],
    },
  };
}
