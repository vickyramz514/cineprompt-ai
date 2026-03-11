"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import DarkPoolTable from "@/components/DarkPoolTable";

export default function DarkPoolPage() {
  const params = useParams();
  const symbol = String(params.symbol ?? "").toUpperCase();
  const { apiKey } = useDataCaptainKey();
  const [trades, setTrades] = useState<{ symbol: string; price: number; volume: number; tradeTime: string }[] | null>(null);
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
      const data = await datacaptainEndpoints.darkpool(apiKey, symbol);
      setTrades(data);
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
          href="/dashboard/darkpool"
          className="text-sm text-white/60 hover:text-white"
        >
          ← Back
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold">Dark Pool Trades — {symbol}</h1>
        <p className="mt-1 text-white/60">Recent dark pool activity</p>
      </div>

      <DarkPoolTable
        trades={trades ?? []}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}
