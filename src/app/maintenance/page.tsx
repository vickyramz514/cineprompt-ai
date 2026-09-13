import type { Metadata } from "next";
import MaintenancePageClient from "./MaintenancePageClient";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Maintenance",
  description: "Data Captain is temporarily unavailable for maintenance.",
  path: "/maintenance",
  noIndex: true,
});

export default function MaintenancePage() {
  return <MaintenancePageClient />;
}
