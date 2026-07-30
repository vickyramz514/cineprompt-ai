"use client";

import { useMemo, useState } from "react";
import type { BacktestResult } from "@/services/datacaptain/endpoints";
import { getPublicApiOrigin } from "@/lib/public-env";

export default function ApiExamplePanel({ result }: { result: BacktestResult }) {
  const [copied, setCopied] = useState(false);
  const origin = getPublicApiOrigin();

  const requestExample = useMemo(() => {
    const q = new URLSearchParams({
      symbol: result.symbol,
      investment: String(result.initialInvestment),
      startDate: result.startDate,
      endDate: result.endDate,
    });
    return `GET ${origin}/v1/backtest/buy-and-hold?${q.toString()}`;
  }, [origin, result]);

  const responseExample = useMemo(
    () =>
      JSON.stringify(
        {
          symbol: result.symbol,
          investment: result.initialInvestment,
          finalValue: result.finalValue,
          totalReturn: result.totalReturn,
          cagr: result.cagr ?? result.annualReturn,
          maxDrawdown: result.maxDrawdown,
        },
        null,
        2
      ),
    [result]
  );

  const copyAll = async () => {
    const text = `${requestExample}\n\n${responseExample}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">Developer</p>
          <h3 className="mt-1 text-lg font-semibold">API Example</h3>
        </div>
        <button
          type="button"
          onClick={copyAll}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-2 text-sm text-white/50">
        Same results via REST (use header <code className="text-white/70">x-api-key</code>). POST body also supported.
      </p>
      <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-emerald-300/90">
        <code>{requestExample}</code>
      </pre>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-white/70">
        <code>{responseExample}</code>
      </pre>
    </div>
  );
}
