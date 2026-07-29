"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STEPS = [
  { id: "key", label: "Copy API Key", href: "/dashboard/api-keys" },
  { id: "request", label: "Make first API request", href: "/dashboard/api-explorer" },
  { id: "docs", label: "Read Docs", href: "/docs" },
  { id: "backtest", label: "Run Backtest", href: "/dashboard/backtesting" },
  { id: "explore", label: "Explore ETF database", href: "/dashboard/etf" },
] as const;

const STORAGE_KEY = "dc_getting_started_v1";

export default function GettingStartedChecklist({ hasKey }: { hasKey: boolean }) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
      if (hasKey) parsed.key = true;
      setDone(parsed);
    } catch {
      setDone(hasKey ? { key: true } : {});
    }
  }, [hasKey]);

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const completed = STEPS.filter((s) => done[s.id]).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">Getting Started</p>
          <h3 className="mt-0.5 text-lg font-semibold">Checklist</h3>
        </div>
        <span className="text-xs tabular-nums text-white/45">
          {completed}/{STEPS.length}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
          style={{ width: `${(completed / STEPS.length) * 100}%` }}
        />
      </div>
      <ul className="mt-4 space-y-2">
        {STEPS.map((s) => (
          <li key={s.id} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggle(s.id)}
              className={`flex h-5 w-5 items-center justify-center rounded border text-[10px] ${
                done[s.id]
                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                  : "border-white/20 text-transparent"
              }`}
              aria-label={done[s.id] ? "Mark incomplete" : "Mark complete"}
            >
              ✓
            </button>
            <Link href={s.href} className="text-sm text-white/75 hover:text-white hover:underline">
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
