"use client";

import { useParams } from "next/navigation";
import EtfDetailView from "@/components/dashboard/EtfDetailView";
import PlanGate from "@/components/dashboard/PlanGate";

export default function EtfDetailPage() {
  const params = useParams();
  const symbol = String(params.symbol ?? "").toUpperCase();
  return (
    <PlanGate feature="etf-detail">
      <EtfDetailView symbol={symbol} />
    </PlanGate>
  );
}
