"use client";

import { Suspense } from "react";
import BillingView from "@/components/dashboard/BillingView";

function BillingFallback() {
  return (
    <div className="space-y-8">
      <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
      <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={<BillingFallback />}>
      <BillingView />
    </Suspense>
  );
}
