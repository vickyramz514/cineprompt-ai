"use client";

import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";

type Card = {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  numeric?: boolean;
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
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-4 backdrop-blur-md"
        >
          <p className="text-[11px] uppercase tracking-wider text-white/40">{c.label}</p>
          <p className={`mt-1.5 text-xl font-semibold tabular-nums ${c.accent || "text-white"}`}>
            {c.numeric && typeof c.value === "number" ? (
              <AnimatedCounter value={c.value} />
            ) : (
              c.value
            )}
          </p>
          {c.sub && <p className="mt-0.5 text-xs text-white/40">{c.sub}</p>}
        </div>
      ))}
    </div>
  );
}
