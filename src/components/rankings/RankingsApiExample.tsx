"use client";

import { useMemo, useState } from "react";
import { getPublicApiOrigin } from "@/lib/public-env";

export default function RankingsApiExample({
  metric,
  period,
  basket,
}: {
  metric: string;
  period: string;
  basket: string;
}) {
  const [copied, setCopied] = useState(false);
  const origin = getPublicApiOrigin();

  const request = useMemo(() => {
    const qs = new URLSearchParams({ metric, period, limit: "25" });
    if (basket) qs.set("basket", basket);
    return `GET ${origin}/api/etf/rankings?${qs.toString()}`;
  }, [origin, metric, period, basket]);

  const response = useMemo(
    () =>
      JSON.stringify(
        {
          metric,
          period,
          total: 120,
          data: [
            {
              rank: 1,
              symbol: "SPY",
              name: "SPDR S&P 500 ETF Trust",
              score: 18.4,
              return1y: 18.4,
              sharpeRatio: 1.2,
              aumBillions: 550,
              rankDelta: 2,
            },
          ],
        },
        null,
        2
      ),
    [metric, period]
  );

  const copy = async () => {
    await navigator.clipboard?.writeText(`${request}\n\n${response}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Developer</p>
          <h3 className="mt-1 text-lg font-semibold">API Example</h3>
        </div>
        <button
          type="button"
          onClick={copy}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-violet-300/90">
        <code>{request}</code>
      </pre>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white/70">
        <code>{response}</code>
      </pre>
    </div>
  );
}
