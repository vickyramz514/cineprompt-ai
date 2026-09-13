import type { Metadata } from "next";
import DocsPageClient from "./DocsPageClient";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "US ETF REST API Documentation",
  description:
    "Data Captain API reference: authenticate with an API key, call ETF universe, prices, screener, rankings, heatmap, backtest, and portfolio endpoints. Official npm and Python SDKs.",
  path: "/docs",
  keywords: ["ETF API docs", "REST API reference", "Data Captain documentation"],
});

export default function DocsPage() {
  return <DocsPageClient />;
}
