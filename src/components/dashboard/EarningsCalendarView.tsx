"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useDataCaptainKey } from "@/hooks/useDataCaptain";
import {
  datacaptainEndpoints,
  getDataCaptainErrorMessage,
  type EarningsCalendarEvent,
} from "@/services/datacaptain/endpoints";

function groupByDate(events: EarningsCalendarEvent[]) {
  const map = new Map<string, EarningsCalendarEvent[]>();
  for (const e of events) {
    const list = map.get(e.reportDate) ?? [];
    list.push(e);
    map.set(e.reportDate, list);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export default function EarningsCalendarView() {
  const { apiKey } = useDataCaptainKey();
  const [events, setEvents] = useState<EarningsCalendarEvent[]>([]);
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);
  const [filterSymbol, setFilterSymbol] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendar = useCallback(async () => {
    if (!apiKey) {
      setLoading(false);
      setError("Set your API key in API Keys to view the earnings calendar.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params: { symbol?: string } = {};
      if (filterSymbol.trim()) params.symbol = filterSymbol.trim().toUpperCase();
      const data = await datacaptainEndpoints.earningsCalendar(apiKey, params);
      setEvents(data.events);
      setRange({ from: data.from, to: data.to });
    } catch (err) {
      setError(getDataCaptainErrorMessage(err));
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey, filterSymbol]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const grouped = useMemo(() => groupByDate(events), [events]);
  const upcoming = events.filter((e) => e.timing === "upcoming").length;
  const reported = events.filter((e) => e.timing === "reported").length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-widest text-violet-300/90">Market data</p>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
            Free on all plans
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Earnings calendar</h1>
        <p className="mt-1 text-sm text-white/50">
          Upcoming and recent US earnings — filter by symbol or open an{" "}
          <Link href="/dashboard/etf" className="text-indigo-400 hover:underline">
            ETF detail
          </Link>
          .
        </p>
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
            Filter symbol
          </label>
          <input
            value={filterSymbol}
            onChange={(e) => setFilterSymbol(e.target.value.toUpperCase())}
            placeholder="All symbols — or AAPL"
            className="w-full max-w-xs rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={fetchCalendar}
          disabled={loading}
          className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {range && (
        <div className="flex flex-wrap gap-4">
          <div className="rounded-xl border border-white/10 bg-[#0c0c14]/80 px-4 py-3">
            <p className="text-xs text-white/40">Range</p>
            <p className="text-sm font-medium text-white">
              {range.from} → {range.to}
            </p>
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3">
            <p className="text-xs text-violet-300/70">Upcoming</p>
            <p className="text-lg font-semibold text-white">{upcoming}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="text-xs text-white/40">Reported</p>
            <p className="text-lg font-semibold text-white">{reported}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <div className="rounded-2xl border border-white/10 py-16 text-center text-white/40">
          No earnings in this window. Run <code className="text-indigo-300">npm run datacaptain:db:seed:snapshot</code>{" "}
          on the API for demo data.
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, dayEvents], gi) => (
            <motion.section
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.04 }}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-sm font-semibold text-white">{date}</span>
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/35">{dayEvents.length} report{dayEvents.length !== 1 ? "s" : ""}</span>
              </div>
              <ul className="space-y-2">
                {dayEvents.map((e) => (
                  <li key={`${e.symbol}-${e.reportDate}`}>
                    <Link
                      href={`/dashboard/snapshot?symbol=${e.symbol}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#0c0c14]/90 px-4 py-3 transition-colors hover:border-indigo-500/30 hover:bg-indigo-500/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 text-sm font-bold text-indigo-300">
                          {e.symbol.slice(0, 2)}
                        </span>
                        <div>
                          <p className="font-semibold text-white">{e.symbol}</p>
                          <p className="text-xs text-white/45">{e.companyName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right text-sm">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            e.timing === "upcoming"
                              ? "bg-violet-500/15 text-violet-300"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {e.timing}
                        </span>
                        {e.eps != null ? (
                          <span className="tabular-nums text-white">EPS {e.eps}</span>
                        ) : e.consensusEps != null ? (
                          <span className="text-white/50">Est. {e.consensusEps}</span>
                        ) : null}
                        {e.surprise != null && (
                          <span className={e.surprise >= 0 ? "text-emerald-400" : "text-red-400"}>
                            {e.surprise >= 0 ? "+" : ""}
                            {e.surprise}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  );
}
