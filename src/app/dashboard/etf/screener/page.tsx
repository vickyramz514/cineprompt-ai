import { Suspense } from "react";
import EtfScreenerView from "@/components/dashboard/EtfScreenerView";

export default function EtfScreenerPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-white/5" />
          <div className="mt-6 h-40 animate-pulse rounded-2xl bg-white/5" />
        </div>
      }
    >
      <EtfScreenerView />
    </Suspense>
  );
}
