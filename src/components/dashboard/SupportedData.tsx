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
    title: "ETF Explorer",
    description: "Browse the US ETF universe and open symbol-level details.",
    tags: ["List", "Search"],
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
    title: "Batch ETF Prices",
    description: "Latest prices for multiple ETF tickers in a single API call.",
    tags: ["Quotes", "Batch"],
    href: "/dashboard/tools/prices",
    accent: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" d="M4 18V8M10 18V4M16 18v-6M22 18V10" />
      </svg>
    ),
  },
  {
    title: "Backtesting",
    description: "Buy-and-hold simulations on historical ETF data — CAGR, drawdown, equity curve.",
    tags: ["History", "Simulations"],
    href: "/dashboard/backtesting",
    accent: "indigo",
    premium: true,
    feature: "backtesting",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5M20 19V9M12 19V3" />
      </svg>
    ),
  },
  {
    title: "Portfolio",
    description: "Compare ETF performance side-by-side — e.g. VOO vs SPY vs QQQ.",
    tags: ["Compare", "Rank"],
    href: "/dashboard/portfolio",
    accent: "cyan",
    premium: true,
    feature: "portfolio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" d="M3 17l4-5 4 3 5-7 5 9M3 20h18" />
      </svg>
    ),
  },
  {
    title: "Market",
    description: "US market session status — open, closed, and next session times.",
    tags: ["Status"],
    href: "/dashboard/api-explorer",
    accent: "sky",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 7v5l3 2" />
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
            ETF datasets available through the DataCaptain API
            {isFree && (
              <span className="text-amber-300/80"> — backtests require a paid plan</span>
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
