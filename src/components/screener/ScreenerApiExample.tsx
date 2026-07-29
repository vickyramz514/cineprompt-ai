"use client";

import { useMemo, useState } from "react";
import { getPublicApiOrigin } from "@/lib/public-env";
import type { ScreenerFilters } from "@/lib/screener/presets";
import { filtersToParams } from "@/lib/screener/presets";

export default function ScreenerApiExample({ filters }: { filters: ScreenerFilters }) {
  const [copied, setCopied] = useState(false);
  const origin = getPublicApiOrigin();

  const request = useMemo(() => {
    const params = filtersToParams(filters, 50, 0);
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v) qs.set(k, v);
    }
    return `GET ${origin}/api/etf/screener?${qs.toString()}`;
  }, [origin, filters]);

  const response = useMemo(
    () =>
      JSON.stringify(
        {
          period: filters.period,
          total: 42,
          limit: 50,
          offset: 0,
          data: [
            {
              symbol: "SPY",
              name: "SPDR S&P 500 ETF Trust",
              return1y: 18.4,
              dividendYieldTtm: 1.2,
              volatility1y: 14.5,
              expenseRatio: 0.09,
              aumBillions: 550,
              category: "Broad Market",
              badges: ["Broad Market"],
            },
          ],
        },
        null,
        2
      ),
    [filters.period]
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
      <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-cyan-300/90">
        <code>{request}</code>
      </pre>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white/70">
        <code>{response}</code>
      </pre>
    </div>
  );
}
