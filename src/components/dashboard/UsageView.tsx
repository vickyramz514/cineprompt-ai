"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import UsageSparkline from "@/components/dashboard/UsageSparkline";
import type { UsageStats } from "@/services/api-usage.service";

type UsageViewProps = {
  stats: UsageStats | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
};

function UsageMeter({
  label,
  used,
  limit,
  accent,
  delay = 0,
}: {
  label: string;
  used: number;
  limit: number;
  accent: "indigo" | "violet";
  delay?: number;
}) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const remaining = Math.max(0, limit - used);
  const isHigh = pct >= 80;

  const barClass =
    accent === "indigo"
      ? "bg-gradient-to-r from-indigo-600 to-indigo-400"
      : "bg-gradient-to-r from-violet-600 to-violet-400";

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">{label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-white">
            <AnimatedCounter value={used} />
            <span className="text-lg font-normal text-white/40"> / {limit.toLocaleString()}</span>
          </p>
        </div>
        <p className={`text-sm font-medium tabular-nums ${isHigh ? "text-amber-400" : "text-emerald-400"}`}>
          {pct.toFixed(0)}%
        </p>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className={`h-full rounded-full ${barClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay }}
        />
      </div>
      <p className="mt-2 text-xs text-white/45">
        {remaining.toLocaleString()} requests remaining
        {isHigh && <span className="text-amber-400/90"> · Approaching limit</span>}
      </p>
    </div>
  );
}

function StatTile({
  label,
  value,
  sub,
  accent,
  icon,
  index,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: "emerald" | "indigo" | "sky";
  icon: ReactNode;
  index: number;
}) {
  const accentRing =
    accent === "emerald"
      ? "group-hover:shadow-[0_0_24px_-8px_rgba(52,211,153,0.4)]"
      : accent === "sky"
        ? "group-hover:shadow-[0_0_24px_-8px_rgba(56,189,248,0.35)]"
        : "group-hover:shadow-[0_0_24px_-8px_rgba(99,102,241,0.4)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.4 }}
      className={`group rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-shadow ${accentRing}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="rounded-lg bg-white/5 p-2 text-white/50">{icon}</div>
      </div>
      <p className="mt-3 text-xs text-white/45">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${accent === "emerald" ? "text-emerald-400" : "text-white"}`}>
        {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-white/40">{sub}</p>}
    </motion.div>
  );
}

export default function UsageView({ stats, isLoading, error, onRefresh }: UsageViewProps) {
  const dailyLimit = stats?.dailyLimit ?? 1000;
  const requestsToday = stats?.requestsToday ?? 0;
  const remainingToday = stats?.remainingToday ?? Math.max(0, dailyLimit - requestsToday);
  const dailyPct = dailyLimit > 0 ? (requestsToday / dailyLimit) * 100 : 0;
  const monthlyLimit = stats?.monthlyLimit ?? 10000;
  const requestsMonth = stats?.requestsThisMonth ?? 0;
  const plan = stats?.plan ?? "free";

  if (isLoading && !stats) {
    return (
      <div className="space-y-8">
        <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-300/80">Analytics</p>
          <h1 className="mt-0.5 text-2xl font-semibold sm:text-3xl">Usage</h1>
          <p className="mt-1 text-sm text-white/50">API request consumption and quota for your account</p>
        </motion.div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 disabled:opacity-50"
        >
          <svg
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
          <p className="mt-2 text-sm text-white/60">
            Ensure your API key is set on the{" "}
            <Link href="/dashboard/api-keys" className="text-indigo-400 hover:underline">
              API Keys
            </Link>{" "}
            page.
          </p>
        </div>
      )}

      {dailyPct >= 80 && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3"
        >
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 10 6zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-200">Daily quota almost used</p>
            <p className="mt-0.5 text-xs text-amber-200/70">
              {remainingToday} requests left today.{" "}
              <Link href="/dashboard/wallet" className="underline hover:text-amber-100">
                Upgrade plan
              </Link>
            </p>
          </div>
        </motion.div>
      )}

      {/* Hero chart panel */}
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-[#0c0c14] to-emerald-500/5 p-6 shadow-[0_0_60px_-16px_rgba(99,102,241,0.3)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Today&apos;s API activity</h2>
            <p className="mt-1 text-sm text-white/45">Resets at midnight UTC</p>
          </div>
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-medium capitalize text-indigo-200">
            {plan} plan
          </span>
        </div>

        <div className="relative mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="relative h-36 flex-1 min-h-[9rem]">
            <UsageSparkline used={requestsToday} limit={dailyLimit} className="absolute inset-0" />
          </div>

          <div className="relative mx-auto shrink-0 lg:mx-0">
            <svg width="112" height="112" className="-rotate-90">
              <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <motion.circle
                cx="56"
                cy="56"
                r="48"
                fill="none"
                stroke="url(#usage-page-ring)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 48}
                initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 48 - (Math.min(dailyPct, 100) / 100) * 2 * Math.PI * 48,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="usage-page-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{Math.min(dailyPct, 100).toFixed(0)}%</span>
              <span className="text-[10px] uppercase tracking-wider text-white/40">daily used</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          index={0}
          label="Requests today"
          value={requestsToday}
          sub={`of ${dailyLimit.toLocaleString()} daily`}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M4 18V8M10 18V4M16 18v-6M22 18V10" />
            </svg>
          }
        />
        <StatTile
          index={1}
          label="Remaining today"
          value={remainingToday}
          accent="emerald"
          sub="Available until reset"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatTile
          index={2}
          label="This month"
          value={requestsMonth}
          sub={`of ${monthlyLimit.toLocaleString()} monthly`}
          accent="sky"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatTile
          index={3}
          label="Daily limit"
          value={dailyLimit}
          sub="Per 24h window"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          }
        />
      </div>

      {/* Meters */}
      <div className="grid gap-4 lg:grid-cols-2">
        <UsageMeter label="Daily quota" used={requestsToday} limit={dailyLimit} accent="indigo" delay={0.2} />
        <UsageMeter
          label="Monthly quota"
          used={requestsMonth}
          limit={monthlyLimit}
          accent="violet"
          delay={0.35}
        />
      </div>

      {/* Quick links */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold text-white/80">Manage usage</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/api-keys"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10"
          >
            API Keys
          </Link>
          <Link
            href="/dashboard/api-docs"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10"
          >
            API Docs
          </Link>
          <Link
            href="/dashboard/wallet"
            className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-4 py-2.5 text-sm text-indigo-200 hover:bg-indigo-500/25"
          >
            Billing & plans
          </Link>
        </div>
      </section>
    </div>
  );
}
