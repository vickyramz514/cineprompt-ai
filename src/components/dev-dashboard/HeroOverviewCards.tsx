"use client";

import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";

type Card = {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  numeric?: boolean;
  icon?: string;
};

const ICONS: Record<string, string> = {
  requests:
    "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  monthly:
    "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
  etfs: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5",
  history:
    "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  market:
    "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941",
  updated:
    "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
};

export default function HeroOverviewCards({
  cards,
  loading,
}: {
  cards: Card[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[88px] animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((c) => {
        const path = c.icon ? ICONS[c.icon] : ICONS.requests;
        return (
          <div
            key={c.label}
            className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-3.5 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] uppercase tracking-wider text-white/40">{c.label}</p>
              <span className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white/40 transition group-hover:text-indigo-300">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                </svg>
              </span>
            </div>
            <p className={`mt-1.5 text-xl font-semibold tabular-nums ${c.accent || "text-white"}`}>
              {c.numeric && typeof c.value === "number" ? (
                <AnimatedCounter value={c.value} />
              ) : (
                c.value
              )}
            </p>
            {c.sub && <p className="mt-0.5 text-[11px] text-white/40">{c.sub}</p>}
          </div>
        );
      })}
    </div>
  );
}
