"use client";

import { useState, useCallback } from "react";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { BatchPrice } from "@/services/datacaptain/endpoints";

export default function BatchPricesPage() {
  const { apiKey } = useDataCaptainKey();
  const [symbolsInput, setSymbolsInput] = useState("AAPL,TSLA,NVDA");
  const [prices, setPrices] = useState<BatchPrice[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    if (!apiKey) {
      setError("Please set your API key in the Dashboard.");
      return;
    }
    const symbols = symbolsInput
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
    if (!symbols.length) {
      setError("Enter at least one symbol.");
      return;
    }
    setLoading(true);
    setError(null);
    setPrices(null);
    try {
      const data = await datacaptainEndpoints.batchPrices(apiKey, symbols.join(","));
      setPrices(data);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [apiKey, symbolsInput]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Batch Stock Price Tool</h1>
        <p className="mt-1 text-white/60">
          Enter comma-separated symbols to fetch current prices
        </p>
      </div>

      <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <label className="block text-sm font-medium text-white/70 mb-2">
          Symbols
        </label>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="AAPL,TSLA,NVDA"
            value={symbolsInput}
            onChange={(e) => setSymbolsInput(e.target.value)}
            className="flex-1 min-w-[200px] rounded-lg border border-white/20 bg-black/30 px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/40 focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={fetchPrices}
            disabled={loading || !apiKey}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Fetching…" : "Fetch Prices"}
          </button>
        </div>
        {!apiKey && (
          <p className="mt-3 text-sm text-amber-400">
            Set your API key in the Dashboard to use this tool.
          </p>
        )}
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {prices && prices.length > 0 && (
        <section className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
          <h2 className="px-6 py-4 text-lg font-semibold border-b border-white/5">
            Results
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-3 text-left font-medium text-white/60">Symbol</th>
                  <th className="px-6 py-3 text-right font-medium text-white/60">Price</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p) => (
                  <tr key={p.symbol} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-6 py-3 font-medium">{p.symbol}</td>
                    <td className="px-6 py-3 text-right">${p.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {prices && prices.length === 0 && !loading && (
        <p className="text-white/50">No prices returned.</p>
      )}
    </div>
  );
}
