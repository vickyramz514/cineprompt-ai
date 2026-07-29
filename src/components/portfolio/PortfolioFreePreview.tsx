"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from "recharts";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import {
  datacaptainEndpoints,
  type BatchPrice,
  type EtfItem,
} from "@/services/datacaptain/endpoints";
import { formatUsdPrecise } from "@/lib/backtest/metrics";
import FreeMarketChart from "@/components/market/FreeMarketChart";

const COLORS = ["#818cf8", "#34d399", "#38bdf8", "#fbbf24", "#f472b6", "#a78bfa"];

type Holding = { symbol: string; shares: number };

const DEFAULT_HOLDINGS: Holding[] = [
  { symbol: "VOO", shares: 40 },
  { symbol: "QQQ", shares: 25 },
  { symbol: "BND", shares: 60 },
];

export default function PortfolioFreePreview() {
  const { apiKey } = useDataCaptainKey();
  const [holdings, setHoldings] = useState<Holding[]>(DEFAULT_HOLDINGS);
  const [prices, setPrices] = useState<BatchPrice[]>([]);
  const [meta, setMeta] = useState<EtfItem[]>([]);
  const [active, setActive] = useState("VOO");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) return;
    const symbols = holdings.map((h) => h.symbol).filter(Boolean);
    if (!symbols.length) return;
    let cancelled = false;
    (async () => {
      try {
        const [batch, list] = await Promise.all([
          datacaptainEndpoints.batchPrices(apiKey, symbols.join(",")),
          datacaptainEndpoints.etfList(apiKey, {
            limit: "50",
            search: symbols[0],
            hasPrice: "1",
          }).catch(() => null),
        ]);
        if (cancelled) return;
        setPrices(batch);
        setMeta(list?.data ?? []);
        setError(null);
      } catch {
        if (!cancelled) setError("Could not load live prices for preview.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiKey, holdings]);

  const priceMap = useMemo(() => new Map(prices.map((p) => [p.symbol, p.price])), [prices]);

  const rows = useMemo(() => {
    return holdings.map((h) => {
      const price = priceMap.get(h.symbol) ?? null;
      const value = price != null ? price * h.shares : null;
      return { ...h, price, value };
    });
  }, [holdings, priceMap]);

  const total = rows.reduce((s, r) => s + (r.value ?? 0), 0);

  const pieData = rows
    .filter((r) => r.value != null && r.value > 0)
    .map((r) => ({
      name: r.symbol,
      value: r.value as number,
      pct: total > 0 ? ((r.value as number) / total) * 100 : 0,
    }));

  const sectorData = useMemo(() => {
    // Heuristic buckets from symbol for free preview composition
    const buckets: Record<string, number> = {};
    for (const r of rows) {
      if (r.value == null) continue;
      let sector = "Broad Market";
      if (["QQQ", "XLK", "VGT", "ARKK"].includes(r.symbol)) sector = "Technology";
      else if (["BND", "AGG", "TLT"].includes(r.symbol)) sector = "Fixed Income";
      else if (["XLE", "XLF", "XLV"].includes(r.symbol)) sector = "Sector";
      buckets[sector] = (buckets[sector] || 0) + r.value;
    }
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [rows]);

  const updateHolding = (i: number, field: keyof Holding, raw: string) => {
    setHoldings((prev) =>
      prev.map((h, idx) => {
        if (idx !== i) return h;
        if (field === "shares") return { ...h, shares: Number(raw) || 0 };
        return { ...h, symbol: raw.toUpperCase() };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-[#0c0c14] to-[#0a0a12] p-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-sky-300/80">Free preview</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Portfolio composition</h2>
        <p className="mt-1 text-sm text-white/50">
          Explore allocation, holdings, and market charts with live batch prices — no upgrade required.
        </p>
        {error && <p className="mt-2 text-sm text-amber-300/80">{error}</p>}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/30 p-3">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Current value</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {total > 0 ? formatUsdPrecise(total) : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 p-3">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Gain / Loss</p>
            <p className="mt-1 text-sm font-medium text-white/45">
              Unlock Pro to track cost basis
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 p-3">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Holdings</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{rows.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
          <h3 className="font-semibold">Allocation</h3>
          <div className="mt-2 h-56">
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0b0b14",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number, name: string) => [
                      `${formatUsdPrecise(v)} (${total ? ((v / total) * 100).toFixed(1) : 0}%)`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/40">
                Add holdings and load prices
              </div>
            )}
          </div>
          <ul className="mt-2 space-y-1 text-sm text-white/60">
            {pieData.map((p, i) => (
              <li key={p.name} className="flex justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {p.name}
                </span>
                <span className="tabular-nums">{p.pct.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
          <h3 className="font-semibold">Holdings</h3>
          <div className="mt-3 space-y-2">
            {holdings.map((h, i) => (
              <div key={i} className="grid grid-cols-[1fr_90px_auto] gap-2">
                <input
                  value={h.symbol}
                  onChange={(e) => updateHolding(i, "symbol", e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 font-mono text-sm text-white"
                  aria-label={`Holding ${i + 1} symbol`}
                />
                <input
                  type="number"
                  value={h.shares}
                  onChange={(e) => updateHolding(i, "shares", e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
                  aria-label={`Holding ${i + 1} shares`}
                />
                <button
                  type="button"
                  onClick={() => setActive(h.symbol)}
                  className="rounded-lg border border-sky-500/30 px-2 text-xs text-sky-200"
                >
                  Chart
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setHoldings((p) => [...p, { symbol: "", shares: 0 }])}
            className="mt-3 text-xs text-sky-300 hover:underline"
          >
            + Add holding
          </button>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] uppercase tracking-wider text-white/35">
                <tr>
                  <th className="py-1">Symbol</th>
                  <th>Shares</th>
                  <th>Price</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.symbol + r.shares} className="border-t border-white/5 text-white/70">
                    <td className="py-1.5 font-mono text-sky-200">{r.symbol || "—"}</td>
                    <td className="tabular-nums">{r.shares}</td>
                    <td className="tabular-nums">
                      {r.price != null ? formatUsdPrecise(r.price) : "—"}
                    </td>
                    <td className="tabular-nums">
                      {r.value != null ? formatUsdPrecise(r.value) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
          <h3 className="font-semibold">Sector / asset exposure</h3>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sectorData.length ? sectorData : [{ name: "—", value: 1 }]}>
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} />
                <YAxis hide />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="rgba(56,189,248,0.25)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-white/55">
            {sectorData.map((s) => (
              <li key={s.name} className="flex justify-between">
                <span>{s.name}</span>
                <span className="tabular-nums">
                  {total > 0 ? `${((s.value / total) * 100).toFixed(0)}%` : "—"}
                </span>
              </li>
            ))}
          </ul>
          {meta[0]?.name ? (
            <p className="mt-3 text-[11px] text-white/35">
              Sample fund context: {meta[0].symbol} · {meta[0].name}
            </p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5">
          <h3 className="font-semibold">Market exposure</h3>
          <p className="mt-1 text-sm text-white/50">
            US-listed ETF exposure based on current holdings. Switch symbols above to update the chart.
          </p>
          <div className="mt-4 space-y-2 text-sm text-white/65">
            <div className="flex justify-between">
              <span>Equity ETFs</span>
              <span className="tabular-nums">
                {total
                  ? `${(
                      (rows
                        .filter((r) => !["BND", "AGG", "TLT"].includes(r.symbol))
                        .reduce((s, r) => s + (r.value ?? 0), 0) /
                        total) *
                      100
                    ).toFixed(0)}%`
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bond / income</span>
              <span className="tabular-nums">
                {total
                  ? `${(
                      (rows
                        .filter((r) => ["BND", "AGG", "TLT"].includes(r.symbol))
                        .reduce((s, r) => s + (r.value ?? 0), 0) /
                        total) *
                      100
                    ).toFixed(0)}%`
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active chart symbol</span>
              <span className="font-mono text-sky-200">{active}</span>
            </div>
          </div>
        </div>
      </div>

      <FreeMarketChart symbol={active || "VOO"} apiKey={apiKey} />
    </div>
  );
}
