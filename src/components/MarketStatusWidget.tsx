"use client";

import { motion } from "framer-motion";
import { useId, useMemo } from "react";
import type { MarketStatus } from "@/services/datacaptain/endpoints";

interface MarketStatusWidgetProps {
  data: MarketStatus | null;
  isLoading?: boolean;
  error?: string | null;
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function marketSessionProgress(nextOpen: string, nextClose: string, isOpen: boolean) {
  const now = Date.now();
  const open = new Date(nextOpen).getTime();
  const close = new Date(nextClose).getTime();
  if (isOpen && close > now) {
    const sessionStart = close - 6.5 * 60 * 60 * 1000;
    const span = close - sessionStart;
    return span > 0 ? Math.min(Math.max((now - sessionStart) / span, 0), 1) : 0.5;
  }
  if (!isOpen && open > now) {
    const day = 24 * 60 * 60 * 1000;
    return Math.min(Math.max(1 - (open - now) / day, 0), 1);
  }
  return 0.35;
}

function MarketPulseChart({ isOpen }: { isOpen: boolean }) {
  const uid = useId().replace(/:/g, "");
  const path = useMemo(() => {
    const pts = Array.from({ length: 40 }, (_, i) => {
      const x = (i / 39) * 280;
      const wave = Math.sin(i * 0.35) * 12 + Math.sin(i * 0.12) * 8;
      const trend = isOpen ? -i * 0.35 : i * 0.15;
      const y = 70 + wave + trend;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return pts.join(" ");
  }, [isOpen]);

  const stroke = isOpen ? "rgb(52, 211, 153)" : "rgb(248, 113, 113)";
  const fillTop = isOpen ? "rgb(52, 211, 153)" : "rgb(248, 113, 113)";

  return (
    <svg viewBox="0 0 280 90" className="h-full w-full opacity-60" aria-hidden>
      <defs>
        <linearGradient id={`mkt-area-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillTop} stopOpacity="0.25" />
          <stop offset="100%" stopColor={fillTop} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${path} L280,90 L0,90 Z`}
        fill={`url(#mkt-area-${uid})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      />
    </svg>
  );
}

export default function MarketStatusWidget({ data, isLoading, error }: MarketStatusWidgetProps) {
  if (error) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-24 rounded-xl bg-white/5" />
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-2/3 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  const isOpen = data.status === "OPEN";
  const progress = marketSessionProgress(data.nextOpen, data.nextClose, isOpen);

  return (
    <motion.div
      className="relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] via-[#0c0c14] to-transparent p-6 shadow-[0_0_40px_-16px_rgba(52,211,153,0.2)]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none">
        <MarketPulseChart isOpen={isOpen} />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/45">US Market</p>
          <h3 className="mt-1 text-lg font-semibold">Market Status</h3>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            className={`relative flex h-2.5 w-2.5 rounded-full ${
              isOpen ? "bg-emerald-400" : "bg-red-400"
            }`}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
              isOpen
                ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30"
                : "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
            }`}
          >
            {data.status}
          </span>
        </div>
      </div>

      <div className="relative mt-8 flex-1">
        <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wider text-white/40">
          <span>{isOpen ? "Session" : "Until open"}</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className={`h-full rounded-full ${
              isOpen
                ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                : "bg-gradient-to-r from-red-900/80 to-red-400"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>

      <div className="relative mt-auto space-y-3 pt-6 text-sm">
        <motion.div
          className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2 backdrop-blur-sm"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-white/45">Next open</span>
          <span className="font-mono text-xs text-white/80">{formatTime(data.nextOpen)}</span>
        </motion.div>
        <motion.div
          className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2 backdrop-blur-sm"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-white/45">Next close</span>
          <span className="font-mono text-xs text-white/80">{formatTime(data.nextClose)}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
