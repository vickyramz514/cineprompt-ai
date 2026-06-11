"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePlanAccess } from "@/hooks/usePlanAccess";

type QuickLink = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  accent: "indigo" | "emerald" | "violet" | "amber";
  featured?: boolean;
  premium?: boolean;
};

const links: QuickLink[] = [
  {
    href: "/dashboard/snapshot",
    title: "Stock Snapshot",
    description: "Quote, AI score, news & earnings in one call",
    accent: "indigo",
    featured: true,
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
    href: "/dashboard/tools/prices",
    title: "Batch Prices",
    description: "Multi-symbol quotes in one request",
    accent: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" d="M4 18V8M10 18V4M16 18v-6M22 18V10" />
      </svg>
    ),
  },
  {
    href: "/dashboard/etf",
    title: "ETF Explorer",
    description: "Browse and drill into ETF data",
    accent: "violet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/economy",
    title: "Economic Indicators",
    description: "Macro data — inflation, GDP, rates",
    accent: "amber",
    premium: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M2 12h20M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    href: "/dashboard/api-explorer",
    title: "API Explorer",
    description: "Try endpoints live with your key",
    accent: "violet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 5h14v14H5z" />
      </svg>
    ),
  },
];

const accentStyles = {
  indigo: {
    ring: "group-hover:ring-indigo-500/40",
    iconBg: "bg-indigo-500/20 text-indigo-300",
    glow: "group-hover:shadow-[0_0_32px_-8px_rgba(99,102,241,0.5)]",
    gradient: "from-indigo-500/15 via-transparent to-transparent",
    arrow: "text-indigo-400",
  },
  emerald: {
    ring: "group-hover:ring-emerald-500/40",
    iconBg: "bg-emerald-500/20 text-emerald-300",
    glow: "group-hover:shadow-[0_0_32px_-8px_rgba(52,211,153,0.45)]",
    gradient: "from-emerald-500/15 via-transparent to-transparent",
    arrow: "text-emerald-400",
  },
  violet: {
    ring: "group-hover:ring-violet-500/40",
    iconBg: "bg-violet-500/20 text-violet-300",
    glow: "group-hover:shadow-[0_0_32px_-8px_rgba(139,92,246,0.45)]",
    gradient: "from-violet-500/15 via-transparent to-transparent",
    arrow: "text-violet-400",
  },
  amber: {
    ring: "group-hover:ring-amber-500/40",
    iconBg: "bg-amber-500/20 text-amber-300",
    glow: "group-hover:shadow-[0_0_32px_-8px_rgba(245,158,11,0.4)]",
    gradient: "from-amber-500/15 via-transparent to-transparent",
    arrow: "text-amber-400",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function MiniSpark({ accent }: { accent: QuickLink["accent"] }) {
  const stroke =
    accent === "emerald"
      ? "rgba(52,211,153,0.35)"
      : accent === "violet"
        ? "rgba(167,139,250,0.35)"
        : accent === "amber"
          ? "rgba(251,191,36,0.35)"
          : "rgba(129,140,248,0.35)";

  return (
    <svg viewBox="0 0 80 24" className="absolute bottom-3 right-3 h-6 w-20 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
      <motion.path
        d="M0,18 L12,14 L24,16 L36,8 L48,10 L60,4 L72,6 L80,2"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function QuickLinks() {
  const { isFree } = usePlanAccess();

  return (
    <section className="relative">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Quick Links</h2>
          <p className="mt-1 text-sm text-white/50">Jump to tools and explorers</p>
        </div>
        <Link
          href="/dashboard/api-docs"
          className="text-sm text-indigo-400 transition-colors hover:text-indigo-300"
        >
          View all docs →
        </Link>
      </div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
      >
        {links.map((link) => {
          const styles = accentStyles[link.accent];
          const locked = Boolean(isFree && link.premium);
          return (
            <motion.div key={link.href} variants={item}>
              <Link href={link.href} className="group relative block h-full">
                <motion.div
                  className={`relative h-full overflow-hidden rounded-2xl border bg-[#0c0c14]/80 p-5 backdrop-blur-sm transition-all duration-300 ${
                    locked
                      ? "border-amber-500/25"
                      : link.featured
                        ? "border-indigo-500/30 ring-1 ring-indigo-500/20"
                        : "border-white/10"
                  } ${locked ? "" : `${styles.ring} ${styles.glow}`}`}
                  whileHover={locked ? undefined : { y: -4, scale: 1.01 }}
                  whileTap={locked ? undefined : { scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-80`}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.35]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />

                  {locked && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3" aria-hidden>
                        <path
                          fillRule="evenodd"
                          d="M10 1a4.5 4.5 0 0 0-2.45 8.26v2.07a1 1 0 0 0 .55.9l3.5 1.75a1 1 0 0 0 .9 0l3.5-1.75a1 1 0 0 0 .55-.9v-2.07A4.5 4.5 0 0 0 10 1Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Pro
                    </span>
                  )}
                  {link.featured && !locked && (
                    <span className="absolute right-3 top-3 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-300">
                      Popular
                    </span>
                  )}

                  <div className={`relative inline-flex rounded-xl p-2.5 ${styles.iconBg}`}>
                    {link.icon}
                  </div>

                  <h3 className="relative mt-4 font-semibold text-white">{link.title}</h3>
                  <p className="relative mt-1 text-sm leading-snug text-white/50">{link.description}</p>

                  <div
                    className={`relative mt-4 flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100 ${styles.arrow}`}
                  >
                    Open
                    <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </div>

                  <MiniSpark accent={link.accent} />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
