"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PlanFeature } from "@/lib/plan-access";
import { planDisplayName } from "@/lib/plan-access";
import { usePlanAccess } from "@/hooks/usePlanAccess";

const FEATURE_COPY: Record<PlanFeature, { title: string; description: string }> = {
  "batch-prices": {
    title: "Batch prices",
    description: "Available on the Free plan.",
  },
  "etf-list": {
    title: "ETF list",
    description: "Available on the Free plan.",
  },
  "etf-detail": {
    title: "ETF details",
    description: "Full ETF symbol data requires a paid plan.",
  },
  backtesting: {
    title: "Backtesting",
    description: "Run buy-and-hold simulations on historical ETF data with a paid plan.",
  },
  portfolio: {
    title: "Portfolio simulator",
    description: "Compare ETF performance side-by-side with a paid plan.",
  },
  options: {
    title: "Options chain",
    description: "Options data is available on Starter and Pro plans.",
  },
  insiders: {
    title: "Insider trades",
    description: "Insider transaction feeds require a paid plan.",
  },
  darkpool: {
    title: "Dark pool",
    description: "Off-exchange trade data requires a paid plan.",
  },
  economy: {
    title: "Economic indicators",
    description: "Macro indicators require a paid plan.",
  },
  "market-screener": {
    title: "Market screener",
    description: "Advanced market tools require a paid plan.",
  },
};

type UpgradePromptProps = {
  feature: PlanFeature;
  compact?: boolean;
};

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );
}

export default function UpgradePrompt({ feature, compact }: UpgradePromptProps) {
  const { plan } = usePlanAccess();
  const copy = FEATURE_COPY[feature];

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-300">
        <LockIcon className="h-3 w-3" />
        Pro
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-[#0c0c14] to-indigo-500/10 p-8 text-center sm:p-10"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15 text-amber-300">
        <LockIcon className="h-8 w-8" />
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-widest text-amber-300/80">
        {planDisplayName(plan)} plan
      </p>
      <h2 className="mt-1 text-xl font-semibold text-white">{copy.title} is locked</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/50">{copy.description}</p>
      <p className="mt-3 text-sm text-white/40">
        Free includes usage stats, market status, batch prices, and ETF list only.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard/wallet"
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-indigo-400"
        >
          Upgrade in Billing
        </Link>
        <Link
          href="/dashboard/usage"
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/70 hover:bg-white/10"
        >
          View usage
        </Link>
      </div>
    </motion.div>
  );
}
