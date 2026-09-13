import type { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "US ETF API Pricing — Free, Starter, Pro & Scale",
  description:
    "Compare Data Captain plans: free tier with 50 requests/day, or paid plans with historical OHLCV, backtesting, portfolio tools, and higher limits. No card for free.",
  path: "/pricing",
  keywords: ["ETF API pricing", "market data API plans", "Data Captain pricing"],
});

export default function PricingPage() {
  return <PricingPageClient />;
}
