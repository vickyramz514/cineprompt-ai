"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import { datacaptainEndpoints, getDataCaptainErrorMessage } from "@/services/datacaptain/endpoints";
import type { BatchPrice } from "@/services/datacaptain/endpoints";
import { getPublicApiOrigin } from "@/lib/public-env";
import JsonHighlight from "@/components/dashboard/JsonHighlight";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder:text-white/35 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

const PRESETS: { label: string; symbols: string }[] = [
  { label: "Broad market", symbols: "SPY,VOO,VTI,DIA,IWM" },
  { label: "Growth", symbols: "QQQ,ARKK,SMH,XLK" },
  { label: "Bonds", symbols: "BND,AGG,TLT,SHY" },
  { label: "Sector", symbols: "XLF,XLE,XLV,XLI" },
];

function parseSymbols(input: string) {
  return input
    .split(/[,\s]+/)
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

export default function BatchPricesView() {
  const { apiKey } = useDataCaptainKey();
  const [symbolsInput, setSymbolsInput] = useState("SPY,QQQ,VOO");
  const [prices, setPrices] = useState<BatchPrice[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const symbolList = useMemo(() => parseSymbols(symbolsInput), [symbolsInput]);

  const fetchPrices = useCallback(async () => {
    if (!apiKey) {
      setError("Set your API key in API Keys to fetch prices.");
      return;
    }
    if (!symbolList.length) {
      setError("Enter at least one symbol.");
      return;
    }
    if (symbolList.length > 50) {
      setError("Maximum 50 symbols per request.");
      return;
    }
    setLoading(true);
    setError(null);
    setPrices(null);
    try {
      const data = await datacaptainEndpoints.batchPrices(apiKey, symbolList.join(","));
      setPrices(data);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [apiKey, symbolList]);

  const copyJson = useCallback(() => {
    if (!prices) return;
    navigator.clipboard.writeText(JSON.stringify(prices, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [prices]);

  const totalValue = useMemo(
    () => (prices ?? []).reduce((sum, p) => sum + (p.price ?? 0), 0),
    [prices]
  );

  const baseUrl = getPublicApiOrigin();
  const apiPath = `/api/stocks/prices?symbols=${symbolList.slice(0, 3).join(",") || "SPY,QQQ"}`;
  const exampleJson = prices
    ? JSON.stringify(prices, null, 2)
    : JSON.stringify(
        [
          { symbol: "SPY", price: 512.34 },
          { symbol: "QQQ", price: 445.12 },
          { symbol: "VOO", price: 468.9 },
        ],
        null,
        2
      );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-300/80">ETF</p>
          <h1 className="mt-0.5 text-2xl font-semibold sm:text-3xl">Batch ETF Prices</h1>
          <p className="mt-1 max-w-xl text-sm text-white/50">
            Fetch up to 50 ETF quotes in one request — comma or space separated tickers
          </p>
        </div>
        <Link
          href="/dashboard/api-docs"
          className="shrink-0 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20"
        >
          API docs
        </Link>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6"
      >
        <label htmlFor="batch-symbols" className="text-xs font-medium uppercase tracking-wider text-white/40">
          Symbols
        </label>
        <textarea
          id="batch-symbols"
          rows={2}
          placeholder="AAPL, TSLA, NVDA"
          value={symbolsInput}
          onChange={(e) => setSymbolsInput(e.target.value)}
          className={`${inputClass} mt-2 resize-y min-h-[52px]`}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/35">Quick add:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setSymbolsInput(p.symbols)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-200"
            >
              {p.label}
            </button>
          ))}
        </div>
        {symbolList.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {symbolList.map((sym) => (
              <span
                key={sym}
                className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-200/90"
              >
                {sym}
              </span>
            ))}
            <span className="self-center text-xs text-white/35">
              {symbolList.length} symbol{symbolList.length === 1 ? "" : "s"}
            </span>
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <motion.button
            type="button"
            onClick={fetchPrices}
            disabled={loading || !apiKey || symbolList.length === 0}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50"
          >
            {loading ? "Fetching…" : "Fetch prices"}
          </motion.button>
          {!apiKey && (
            <Link
              href="/dashboard/api-keys"
              className="self-center text-sm text-amber-400/90 hover:underline"
            >
              Set API key →
            </Link>
          )}
        </div>
      </motion.section>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <AnimatePresence>
        {prices && prices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl border border-white/10 bg-[#0c0c14]/90 px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-white/35">Quotes</p>
                  <p className="mt-0.5 text-xl font-semibold tabular-nums text-white">{prices.length}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-white/35">Sum of prices</p>
                  <p className="mt-0.5 text-xl font-semibold tabular-nums text-emerald-200">
                    ${totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={copyJson}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/60 hover:bg-white/10"
              >
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {prices.map((p, i) => (
                <motion.div
                  key={p.symbol}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 0.25) }}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-[#0c0c14] to-[#0c0c14] p-4"
                >
                  <p className="font-mono text-sm font-semibold text-emerald-300">{p.symbol}</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-white">${p.price.toFixed(2)}</p>
                </motion.div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]/90">
              <h2 className="border-b border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold">
                Table view
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                      <th className="px-5 py-3 font-medium">#</th>
                      <th className="px-5 py-3 font-medium">Symbol</th>
                      <th className="px-5 py-3 text-right font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((p, i) => (
                      <tr
                        key={p.symbol}
                        className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
                      >
                        <td className="px-5 py-3 text-white/30 tabular-nums">{i + 1}</td>
                        <td className="px-5 py-3 font-mono font-medium text-emerald-300/90">{p.symbol}</td>
                        <td className="px-5 py-3 text-right font-semibold tabular-nums text-white">
                          ${p.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {prices && prices.length === 0 && !loading && (
        <p className="text-center text-sm text-white/50">No prices returned for those symbols.</p>
      )}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]/90"
      >
        <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
          <h2 className="text-lg font-semibold">API endpoint</h2>
          <p className="mt-1 text-sm text-white/45">
            <code className="text-emerald-300/90">GET /api/stocks/prices</code> — cached ~60s, max 50 symbols
          </p>
        </div>
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
            <p className="text-xs font-medium uppercase tracking-wider text-white/35">Request</p>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-white/80">
              {`GET ${baseUrl}${apiPath}\nx-api-key: YOUR_API_KEY`}
            </pre>
          </div>
          <div className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-white/35">Response</p>
            <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs">
              <JsonHighlight json={exampleJson} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 border-t border-white/10 px-5 py-4">
          <Link href="/dashboard/api-explorer" className="text-sm text-indigo-400/90 hover:text-indigo-300">
            Try in API Explorer →
          </Link>
          <Link href="/dashboard/usage" className="text-sm text-white/45 hover:text-white/70">
            View usage →
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
