import type { Metadata } from "next";
import StatusPageClient from "./StatusPageClient";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "API System Status",
  description:
    "Live health of the Data Captain US ETF API and market data pipeline. Check operational status before you ship.",
  path: "/status",
});

export default function StatusPage() {
  return <StatusPageClient />;
}
