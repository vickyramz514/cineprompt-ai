"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import UsageSparkline from "@/components/dashboard/UsageSparkline";

interface DashboardCardsProps {
  requestsToday: number;
  requestsRemaining: number;
  dailyLimit: number;
  plan: string;
  isLoading?: boolean;
}

const statVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function DashboardCards({
  requestsToday,
  requestsRemaining,
  dailyLimit,
  plan,
  isLoading,
}: DashboardCardsProps) {
  const usagePct = dailyLimit > 0 ? Math.min((requestsToday / dailyLimit) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 42;
  const strokeOffset = circumference - (usagePct / 100) * circumference;

  const stats = [
    { label: "Requests Today", value: requestsToday, numeric: true },
    { label: "Remaining", value: requestsRemaining, numeric: true, accent: "emerald" as const },
    { label: "Daily Limit", value: dailyLimit, numeric: true },
    { label: "Plan", value: plan, numeric: false },
  ];

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/5 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-32 rounded bg-white/10" />
          <div className="h-36 rounded-xl bg-white/5" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-[#0c0c14] to-emerald-500/5 p-6 shadow-[0_0_60px_-12px_rgba(99,102,241,0.25)]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">
            API Usage
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">Today&apos;s activity</h3>
        </div>
        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-medium capitalize text-indigo-200">
          {plan}
        </span>
      </div>

      <div className="relative mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative h-36 min-h-[9rem] flex-1 sm:h-40">
          <UsageSparkline used={requestsToday} limit={dailyLimit} className="absolute inset-0" />
          <motion.div
            className="absolute bottom-2 left-2 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-white/70 backdrop-blur-sm"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            Live usage trend
          </motion.div>
        </div>

        <div className="relative mx-auto shrink-0 sm:mx-0">
          <svg width="100" height="100" className="-rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#usage-ring-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: strokeOffset }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
            <defs>
              <linearGradient id="usage-ring-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-2xl font-bold text-white"
              key={usagePct}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {usagePct.toFixed(0)}%
            </motion.span>
            <span className="text-[10px] uppercase tracking-wider text-white/45">used</span>
          </div>
        </div>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, numeric, accent }, i) => (
          <motion.div
            key={label}
            custom={i}
            variants={statVariants}
            initial="hidden"
            animate="show"
            className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 backdrop-blur-sm transition-colors hover:border-white/10 hover:bg-white/[0.05]"
          >
            <p className="text-xs text-white/50">{label}</p>
            <p
              className={`mt-1 text-xl font-bold tabular-nums ${
                accent === "emerald" ? "text-emerald-400" : "text-white"
              }`}
            >
              {numeric && typeof value === "number" ? (
                <AnimatedCounter value={value} />
              ) : (
                value
              )}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
