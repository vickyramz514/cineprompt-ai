"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import OptionsTable from "@/components/OptionsTable";

export default function OptionsChainPage() {
  const params = useParams();
  const symbol = String(params.symbol ?? "").toUpperCase();
  const { apiKey } = useDataCaptainKey();
  const [data, setData] = useState<{ calls: { strike: number; bid: number | null; ask: number | null; volume: number | null; openInterest: number | null }[]; puts: { strike: number; bid: number | null; ask: number | null; volume: number | null; openInterest: number | null }[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!apiKey || !symbol) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await datacaptainEndpoints.optionsChain(apiKey, symbol);
      setData({ calls: res.calls ?? [], puts: res.puts ?? [] });
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [apiKey, symbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/options"
          className="text-sm text-white/60 hover:text-white"
        >
          ← Back
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Options Chain — {symbol}</h1>
        <p className="mt-1 text-white/60">Calls and Puts</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <OptionsTable
          legs={data?.calls ?? []}
          title="Calls"
          isLoading={loading}
        />
        <OptionsTable
          legs={data?.puts ?? []}
          title="Puts"
          isLoading={loading}
        />
      </div>
    </div>
  );
}
