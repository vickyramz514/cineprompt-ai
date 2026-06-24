"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type RebalanceResult,
} from "@/services/datacaptain/endpoints";

type HoldingRow = { symbol: string; shares: string };
type TargetRow = { symbol: string; weight: string };

const PRESETS = [
  {
    label: "60/40 VOO · QQQ",
    holdings: [
      { symbol: "VOO", shares: "63" },
      { symbol: "QQQ", shares: "37" },
    ],
    target: [
      { symbol: "VOO", weight: "60" },
      { symbol: "QQQ", weight: "40" },
    ],
  },
  {
    label: "Three-fund",
    holdings: [
      { symbol: "VTI", shares: "50" },
      { symbol: "VXUS", shares: "30" },
      { symbol: "BND", shares: "20" },
    ],
    target: [
      { symbol: "VTI", weight: "50" },
      { symbol: "VXUS", weight: "30" },
      { symbol: "BND", weight: "20" },
    ],
  },
];

function sumWeights(rows: TargetRow[]) {
  return rows.reduce((s, r) => s + (parseFloat(r.weight) || 0), 0);
}

export default function PortfolioRebalancerView() {
  const { apiKey } = useDataCaptainKey();
  const [holdings, setHoldings] = useState<HoldingRow[]>([
    { symbol: "VOO", shares: "63" },
    { symbol: "QQQ", shares: "37" },
  ]);
  const [target, setTarget] = useState<TargetRow[]>([
    { symbol: "VOO", weight: "60" },
    { symbol: "QQQ", weight: "40" },
  ]);
  const [driftThreshold, setDriftThreshold] = useState("2");
  const [contributionsOnly, setContributionsOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RebalanceResult | null>(null);

  const weightSum = useMemo(() => sumWeights(target), [target]);

  const updateHolding = (index: number, field: keyof HoldingRow, value: string) => {
    setHoldings((rows) =>
      rows.map((r, i) => (i === index ? { ...r, [field]: value.toUpperCase() } : r))
    );
  };

  const updateTarget = (index: number, field: keyof TargetRow, value: string) => {
    setTarget((rows) =>
      rows.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const addRow = () => {
    setHoldings((rows) => [...rows, { symbol: "", shares: "" }]);
    setTarget((rows) => [...rows, { symbol: "", weight: "" }]);
  };

  const removeRow = (index: number) => {
    if (holdings.length <= 1) return;
    setHoldings((rows) => rows.filter((_, i) => i !== index));
    setTarget((rows) => rows.filter((_, i) => i !== index));
  };

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setHoldings(preset.holdings.map((h) => ({ ...h })));
    setTarget(preset.target.map((t) => ({ ...t })));
  };

  const runRebalance = async () => {
    if (!apiKey) {
      setError("Sign in and set your API key to run the rebalancer.");
      return;
    }
    if (Math.abs(weightSum - 100) > 0.5) {
      setError(`Target weights must sum to 100% (currently ${weightSum.toFixed(1)}%).`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await datacaptainEndpoints.portfolioRebalance(apiKey, {
        holdings: holdings
          .filter((h) => h.symbol.trim())
          .map((h) => ({
            symbol: h.symbol.trim(),
            shares: parseFloat(h.shares) || 0,
          })),
        target: target
          .filter((t) => t.symbol.trim())
          .map((t) => ({
            symbol: t.symbol.trim(),
            weight: parseFloat(t.weight) || 0,
          })),
        driftThreshold: parseFloat(driftThreshold) || 0,
        mode: contributionsOnly ? "contributions_only" : "rebalance",
      });
      setResult(data);
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:border-sky-500/30 hover:text-white"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
          <h2 className="text-lg font-semibold">Current holdings</h2>
          <p className="mt-1 text-xs text-white/45">Shares held today</p>
          <div className="mt-4 space-y-3">
            {holdings.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={row.symbol}
                  onChange={(e) => updateHolding(i, "symbol", e.target.value)}
                  placeholder="VOO"
                  className="w-24 rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-white"
                />
                <input
                  value={row.shares}
                  onChange={(e) => updateHolding(i, "shares", e.target.value)}
                  placeholder="Shares"
                  type="number"
                  step="any"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-white"
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="rounded-lg px-2 text-white/30 hover:text-white/60"
                  aria-label="Remove row"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
          <h2 className="text-lg font-semibold">Target allocation</h2>
          <p className="mt-1 text-xs text-white/45">
            Target weights — sum{" "}
            <span className={Math.abs(weightSum - 100) > 0.5 ? "text-amber-300" : "text-emerald-300"}>
              {weightSum.toFixed(1)}%
            </span>
          </p>
          <div className="mt-4 space-y-3">
            {target.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={row.symbol}
                  onChange={(e) => updateTarget(i, "symbol", e.target.value)}
                  placeholder="QQQ"
                  className="w-24 rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-white"
                />
                <div className="relative flex-1">
                  <input
                    value={row.weight}
                    onChange={(e) => updateTarget(i, "weight", e.target.value)}
                    placeholder="40"
                    type="number"
                    step="0.1"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 pr-8 font-mono text-sm text-white"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
                    %
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="rounded-lg px-2 text-white/30 hover:text-white/60"
                  aria-label="Remove row"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-[#0c0c14]/60 p-6">
        <label className="block text-sm">
          <span className="text-white/50">Drift threshold (%)</span>
          <input
            type="number"
            step="0.5"
            min="0"
            value={driftThreshold}
            onChange={(e) => setDriftThreshold(e.target.value)}
            className="mt-1 block w-32 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={contributionsOnly}
            onChange={(e) => setContributionsOnly(e.target.checked)}
            className="rounded border-white/20"
          />
          Contributions only (no sells)
        </label>
        <button
          type="button"
          onClick={addRow}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
        >
          + Add ETF
        </button>
        <button
          type="button"
          onClick={runRebalance}
          disabled={loading}
          className="ml-auto rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-8 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Calculating…" : "Calculate rebalance"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <p className="text-xs text-white/45">Portfolio value</p>
              <p className="text-xl font-semibold tabular-nums text-white">
                ${result.totalValue.toLocaleString()}
              </p>
            </div>
            {result.needsRebalance ? (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Rebalance suggested — max drift{" "}
                <span className="font-mono font-semibold">
                  {result.maxDrift?.symbol} {result.maxDrift?.drift}%
                </span>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                Portfolio is within your drift threshold.
              </div>
            )}
          </div>

          {result.trades.length > 0 && (
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
              <h3 className="font-semibold text-white">Suggested trades</h3>
              <ul className="mt-3 space-y-2">
                {result.trades.map((t) => (
                  <li
                    key={`${t.symbol}-${t.action}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm"
                  >
                    <span className="font-mono font-semibold text-white">{t.symbol}</span>
                    <span
                      className={
                        t.action === "BUY" ? "font-semibold text-emerald-400" : "font-semibold text-rose-400"
                      }
                    >
                      {t.action} {t.shares} shares · ${t.value.toLocaleString()}
                    </span>
                    <span className="w-full text-xs text-white/45 sm:w-auto">{t.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-white/45">
                <tr>
                  <th className="px-4 py-3">ETF</th>
                  <th className="px-4 py-3 text-right">Current</th>
                  <th className="px-4 py-3 text-right">Target</th>
                  <th className="px-4 py-3 text-right">Drift</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {result.allocation.map((row) => (
                  <tr key={row.symbol} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/etf/${row.symbol}`}
                        className="font-mono font-semibold text-sky-300 hover:underline"
                      >
                        {row.symbol}
                      </Link>
                      <p className="text-xs text-white/40">{row.name}</p>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-white">
                      {row.currentWeight}%
                      <span className="block text-xs text-white/40">
                        ${row.currentValue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-white/70">
                      {row.targetWeight}%
                    </td>
                    <td
                      className={`px-4 py-3 text-right tabular-nums font-medium ${
                        row.drift > 0 ? "text-emerald-400" : row.drift < 0 ? "text-rose-400" : "text-white/50"
                      }`}
                    >
                      {row.drift > 0 ? "+" : ""}
                      {row.drift}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.action === "BUY"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : row.action === "SELL"
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-white/10 text-white/45"
                        }`}
                      >
                        {row.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
