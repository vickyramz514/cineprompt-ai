"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StockSnapshotView from "@/components/dashboard/StockSnapshotView";

function SnapshotPageInner() {
  const searchParams = useSearchParams();
  const symbol = searchParams.get("symbol");
  return <StockSnapshotView key={symbol ?? "default"} initialSymbol={symbol ?? undefined} />;
}

function SnapshotFallback() {
  return (
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
      <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
    </div>
  );
}

export default function SnapshotPage() {
  return (
    <Suspense fallback={<SnapshotFallback />}>
      <SnapshotPageInner />
    </Suspense>
  );
}
