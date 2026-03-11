"use client";

import { useEffect, useState, useCallback } from "react";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { EconomicIndicators } from "@/services/datacaptain/endpoints";

const indicators = [
  { key: "inflation" as const, label: "Inflation", suffix: "%" },
  { key: "interestRate" as const, label: "Interest Rate", suffix: "%" },
  { key: "gdpGrowth" as const, label: "GDP Growth", suffix: "%" },
  { key: "unemploymentRate" as const, label: "Unemployment Rate", suffix: "%" },
] as const;

export default function EconomyPage() {
  const { apiKey } = useDataCaptainKey();
  const [data, setData] = useState<EconomicIndicators | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!apiKey) {
      setLoading(false);
      setError("Set your API key in the Dashboard.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await datacaptainEndpoints.economyIndicators(apiKey);
      setData(res);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Economic Indicators</h1>
        <p className="mt-1 text-white/60">
          Key US economic indicators
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 h-28 animate-pulse">
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="h-8 w-16 rounded bg-white/10 mt-4" />
            </div>
          ))}
        </div>
      ) : data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {indicators.map(({ key, label, suffix }) => (
            <div
              key={key}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-6"
            >
              <p className="text-sm text-white/60">{label}</p>
              <p className="mt-2 text-2xl font-bold">
                {(data[key] ?? 0).toFixed(2)}{suffix}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
