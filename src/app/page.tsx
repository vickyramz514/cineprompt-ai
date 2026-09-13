import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "US ETF Data API & Backtesting — Free Tier",
  description:
    "Data Captain is a US ETF data API for developers: historical prices, screener, heatmap, rankings, backtesting, and portfolio tools. Free API key — no card required.",
  path: "",
  keywords: [
    "ETF API",
    "US ETF data",
    "historical ETF prices",
    "ETF screener API",
    "backtesting API",
    "Data Captain",
  ],
});

export default function HomePage() {
  const site = getSiteUrl();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Data Captain",
      url: site,
      logo: `${site}/logo/logo.jpeg`,
      email: "support@datacaptain.in",
      sameAs: [
        "https://www.npmjs.com/package/datacaptain",
        "https://pypi.org/project/datacaptain/",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Data Captain",
      url: site,
      description:
        "US ETF data API with screener, historical prices, backtesting, and portfolio tools for developers.",
      publisher: { "@type": "Organization", name: "Data Captain" },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Data Captain ETF API",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      url: site,
      description:
        "REST API and SDKs for US ETF market data, backtesting, and portfolio analytics.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free tier with daily request limits",
      },
    },
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <HomePageClient />
    </>
  );
}
