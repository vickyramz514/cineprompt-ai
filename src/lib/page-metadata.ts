import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Data Captain — US ETF Data API for developers",
} as const;

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

/** Consistent title / description / canonical / OG / Twitter for marketing pages. */
export function buildPageMetadata({
  title,
  description,
  path = "",
  keywords,
  noIndex,
}: PageMetaInput): Metadata {
  const site = getSiteUrl();
  const url = `${site}${path}`;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : { alternates: { canonical: url } }),
    openGraph: {
      title,
      description,
      url: noIndex ? undefined : url,
      type: "website",
      siteName: "Data Captain",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export { OG_IMAGE };
