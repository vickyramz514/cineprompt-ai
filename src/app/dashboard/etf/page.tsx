"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { EtfItem } from "@/services/datacaptain/endpoints";

export default function EtfListPage() {
  const { apiKey } = useDataCaptainKey();
  const [etfs, setEtfs] = useState<EtfItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEtfs = useCallback(async () => {
    if (!apiKey) {
      setLoading(false);
      setError("Set your API key in the Dashboard.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await datacaptainEndpoints.etfList(apiKey);
      setEtfs(data);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    fetchEtfs();
  }, [fetchEtfs]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">ETF Explorer</h1>
        <p className="mt-1 text-white/60">
          Browse exchange-traded funds
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 h-32 animate-pulse">
              <div className="h-4 w-16 rounded bg-white/10 mb-3" />
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-6 w-20 rounded bg-white/10 mt-4" />
            </div>
          ))}
        </div>
      ) : etfs && etfs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {etfs.map((etf) => (
            <Link
              key={etf.symbol}
              href={`/dashboard/etf/${encodeURIComponent(etf.symbol)}`}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-indigo-500/30 hover:bg-white/[0.04]"
            >
              <p className="font-semibold text-indigo-400">{etf.symbol}</p>
              <p className="mt-1 text-sm text-white/70 line-clamp-2">{etf.name}</p>
              {etf.price != null ? (
                <p className="mt-3 text-lg font-semibold">${etf.price.toFixed(2)}</p>
              ) : (
                <p className="mt-3 text-white/40">—</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-white/50">No ETFs found.</p>
      )}
    </div>
  );
}
