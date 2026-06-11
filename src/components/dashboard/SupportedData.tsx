"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import type { PlanFeature } from "@/lib/plan-access";

type DataCategory = {
  title: string;
  description: string;
  tags: string[];
  href: string;
  accent: "indigo" | "emerald" | "violet" | "amber" | "cyan" | "rose" | "sky";
  icon: ReactNode;
  premium?: boolean;
  feature?: PlanFeature;
};

const categories: DataCategory[] = [
  {
    title: "Stock Snapshot",
    description: "All-in-one symbol view — quote, sentiment, AI score, news, and earnings.",
    tags: ["Free API", "1 request"],
    href: "/dashboard/snapshot",
    accent: "indigo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path strokeLinecap="round" d="M14 17h7M17.5 14v7" />
      </svg>
    ),
  },
  {
    title: "Stocks",
    description: "Prices, history, candles, dividends, and company profiles for US equities.",
    tags: ["OHLCV", "Profile"],
    href: "/dashboard/tools/prices",
    accent: "cyan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" d="M4 18V8M10 18V4M16 18v-6M22 18V10" />
      </svg>
    ),
  },
  {
    title: "ETFs",
    description: "Listings and symbol-level data for major exchange-traded funds.",
    tags: ["List", "Holdings"],
    href: "/dashboard/etf",
    accent: "violet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" d="M4 6h16M4 12h10M4 18h6" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
  {
    title: "Options",
    description: "Options chains with strikes, bids, asks, volume, and open interest.",
    tags: ["Calls", "Puts"],
    href: "/dashboard/options",
    accent: "emerald",
    premium: true,
    feature: "options",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V8m5 8V4m5 12v-6" />
        <path strokeLinecap="round" d="M3 20h18" />
      </svg>
    ),
  },
  {
    title: "Insiders",
    description: "Insider transactions — filings, share counts, and trade types.",
    tags: ["SEC", "Trades"],
    href: "/dashboard/insiders",
    accent: "amber",
    premium: true,
    feature: "insiders",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" />
      </svg>
    ),
  },
  {
    title: "Dark Pool",
    description: "Off-exchange block trades with price, volume, and timestamps.",
    tags: ["Blocks", "Volume"],
    href: "/dashboard/darkpool",
    accent: "rose",
    premium: true,
    feature: "darkpool",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    title: "Economy",
    description: "Macro indicators — inflation, rates, GDP growth, and unemployment.",
    tags: ["Macro", "Rates"],
    href: "/dashboard/economy",
    accent: "cyan",
    premium: true,
    feature: "economy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M2 12h20M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </svg>
    ),
  },
  {
    title: "Market",
    description: "Top gainers, losers, most active, screener, and market status.",
    tags: ["Live", "Screener"],
    href: "/dashboard/api-explorer",
    accent: "sky",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l4-5 4 3 5-7 5 9" />
        <path strokeLinecap="round" d="M3 20h18" />
      </svg>
    ),
  },
  {
    title: "AI Scores",
    description: "Stock sentiment and AI-powered scores via the DataCaptain API.",
    tags: ["Sentiment", "Score"],
    href: "/dashboard/api-docs",
    accent: "indigo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75 12 2l2.25 1.75L16.5 2.5 18 5.25l2.25.75-.75 2.25L21 10.5l-1.75 2.25L21 15l-2.25 1.75.75 2.25L18 19.75l-1.5 2.75L12 21l-2.25 1.5L8.25 19.75 6 21l-.75-2.25L3 18l1.75-2.25L3 13.5l1.75-2.25L3 10.5l2.25-.75L6 7.5 4.5 4.75 6 2.5Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

const accentStyles = {
  indigo: {
    iconBg: "bg-indigo-500/20 text-indigo-300",
    tag: "border-indigo-500/25 bg-indigo-500/10 text-indigo-300/90",
    gradient: "from-indigo-500/12 via-transparent to-transparent",
    ring: "group-hover:ring-indigo-500/35",
    glow: "group-hover:shadow-[0_0_28px_-10px_rgba(99,102,241,0.45)]",
    bar: "bg-indigo-400/50",
  },
  emerald: {
    iconBg: "bg-emerald-500/20 text-emerald-300",
    tag: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300/90",
    gradient: "from-emerald-500/12 via-transparent to-transparent",
    ring: "group-hover:ring-emerald-500/35",
    glow: "group-hover:shadow-[0_0_28px_-10px_rgba(52,211,153,0.4)]",
    bar: "bg-emerald-400/50",
  },
  violet: {
    iconBg: "bg-violet-500/20 text-violet-300",
    tag: "border-violet-500/25 bg-violet-500/10 text-violet-300/90",
    gradient: "from-violet-500/12 via-transparent to-transparent",
    ring: "group-hover:ring-violet-500/35",
    glow: "group-hover:shadow-[0_0_28px_-10px_rgba(139,92,246,0.4)]",
    bar: "bg-violet-400/50",
  },
  amber: {
    iconBg: "bg-amber-500/20 text-amber-300",
    tag: "border-amber-500/25 bg-amber-500/10 text-amber-300/90",
    gradient: "from-amber-500/12 via-transparent to-transparent",
    ring: "group-hover:ring-amber-500/35",
    glow: "group-hover:shadow-[0_0_28px_-10px_rgba(245,158,11,0.35)]",
    bar: "bg-amber-400/50",
  },
  rose: {
    iconBg: "bg-rose-500/20 text-rose-300",
    tag: "border-rose-500/25 bg-rose-500/10 text-rose-300/90",
    gradient: "from-rose-500/12 via-transparent to-transparent",
    ring: "group-hover:ring-rose-500/35",
    glow: "group-hover:shadow-[0_0_28px_-10px_rgba(244,63,94,0.35)]",
    bar: "bg-rose-400/50",
  },
  cyan: {
    iconBg: "bg-cyan-500/20 text-cyan-300",
    tag: "border-cyan-500/25 bg-cyan-500/10 text-cyan-300/90",
    gradient: "from-cyan-500/12 via-transparent to-transparent",
    ring: "group-hover:ring-cyan-500/35",
    glow: "group-hover:shadow-[0_0_28px_-10px_rgba(34,211,238,0.35)]",
    bar: "bg-cyan-400/50",
  },
  sky: {
    iconBg: "bg-sky-500/20 text-sky-300",
    tag: "border-sky-500/25 bg-sky-500/10 text-sky-300/90",
    gradient: "from-sky-500/12 via-transparent to-transparent",
    ring: "group-hover:ring-sky-500/35",
    glow: "group-hover:shadow-[0_0_28px_-10px_rgba(56,189,248,0.35)]",
    bar: "bg-sky-400/50",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

function MiniBars({ accent, seed }: { accent: DataCategory["accent"]; seed: number }) {
  const styles = accentStyles[accent];
  const heights = [0.35, 0.55, 0.4, 0.7, 0.5, 0.85, 0.6, 0.75].map(
    (h, i) => h * (0.85 + ((seed + i) % 5) * 0.03)
  );

  return (
    <div className="flex h-8 items-end justify-end gap-0.5 opacity-40 transition-opacity group-hover:opacity-70">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className={`w-1 rounded-sm ${styles.bar}`}
          style={{ height: `${h * 100}%` }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 * i, duration: 0.35 }}
        />
      ))}
    </div>
  );
}

export default function SupportedData() {
  const { isFree } = usePlanAccess();

  return (
    <section className="relative">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Supported Data</h2>
          <p className="mt-1 text-sm text-white/50">
            Market datasets available through the DataCaptain API
            {isFree && (
              <span className="text-amber-300/80"> — some require a paid plan</span>
            )}
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
          {categories.length} categories
        </span>
      </div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {categories.map((cat, index) => {
          const styles = accentStyles[cat.accent];
          const locked = Boolean(isFree && cat.premium);
          return (
            <motion.div key={cat.title} variants={item}>
              <Link href={cat.href} className="group relative block h-full">
                <motion.div
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#0c0c14]/90 p-5 backdrop-blur-sm ring-1 ring-transparent transition-shadow ${
                    locked ? "border-amber-500/20 opacity-90" : `border-white/10 ${styles.ring} ${styles.glow}`
                  }`}
                  whileHover={{ y: locked ? 0 : -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.gradient}`}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.25]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                      backgroundSize: "14px 14px",
                    }}
                  />

                  <div className="relative flex items-start justify-between gap-2">
                    <div className={`rounded-xl p-2.5 ${locked ? "bg-amber-500/15 text-amber-300/80" : styles.iconBg}`}>
                      {cat.icon}
                    </div>
                    {locked ? (
                      <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                          <path
                            fillRule="evenodd"
                            d="M10 1a4.5 4.5 0 0 0-2.45 8.26v2.07a1 1 0 0 0 .55.9l3.5 1.75a1 1 0 0 0 .9 0l3.5-1.75a1 1 0 0 0 .55-.9v-2.07A4.5 4.5 0 0 0 10 1Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Pro
                      </span>
                    ) : (
                      <MiniBars accent={cat.accent} seed={index} />
                    )}
                  </div>

                  <h3 className="relative mt-4 font-semibold text-white">{cat.title}</h3>
                  <p className="relative mt-1.5 flex-1 text-sm leading-snug text-white/50">
                    {cat.description}
                  </p>

                  <div className="relative mt-4 flex flex-wrap gap-1.5">
                    {cat.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${styles.tag}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="relative mt-4 flex items-center gap-1 text-xs font-medium text-white/40 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-white/70">
                    Explore
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
