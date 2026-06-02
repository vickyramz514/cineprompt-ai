"use client";

import { useParams } from "next/navigation";
import EtfDetailView from "@/components/dashboard/EtfDetailView";

export default function EtfDetailPage() {
  const params = useParams();
  const symbol = String(params.symbol ?? "").toUpperCase();
  return <EtfDetailView symbol={symbol} />;
}
