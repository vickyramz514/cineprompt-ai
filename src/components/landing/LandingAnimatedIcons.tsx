"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

const iconWrap =
  "mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/15 to-violet-600/10 shadow-lg shadow-indigo-500/5";

/** Gentle perpetual float — offset delay so items don’t sync */
function FloatIcon({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`${iconWrap} ${className}`}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: delay * 0.08 }}
      whileHover={{ scale: 1.06, borderColor: "rgba(129, 140, 248, 0.45)" }}
    >
      <motion.span
        className="flex h-full w-full items-center justify-center text-indigo-300"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}

export function FeatureIconHistorical() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8 36h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M10 28l6-10 6 6 8-14 8 10v12H10V28z" stroke="url(#gf1)" strokeWidth="2" strokeLinejoin="round" />
      <defs>
        <linearGradient id="gf1" x1="8" y1="14" x2="40" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FeatureIconApi() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M14 24h8M26 24h8M18 16l-4 8 4 8M30 16l4 8-4 8"
        stroke="url(#gf2)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
      <defs>
        <linearGradient id="gf2" x1="14" y1="16" x2="34" y2="32">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FeatureIconDev() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="10" y="14" width="28" height="20" rx="3" stroke="url(#gf3)" strokeWidth="2" />
      <path d="M14 20l3 3-3 3M26 29h8" stroke="url(#gf3)" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="gf3" x1="10" y1="14" x2="38" y2="34">
          <stop stopColor="#93c5fd" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FeatureIconFast() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M26 6L10 28h12l-2 14 18-24H24l2-12z"
        fill="url(#gf4)"
        stroke="url(#gf4)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="gf4" x1="10" y1="6" x2="38" y2="42">
          <stop stopColor="#fde047" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FeatureIconEtf() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="8" y="28" width="6" height="12" rx="1" fill="currentColor" className="text-indigo-400/80" />
      <rect x="17" y="20" width="6" height="20" rx="1" fill="currentColor" className="text-indigo-400" />
      <rect x="26" y="24" width="6" height="16" rx="1" fill="currentColor" className="text-violet-400/90" />
      <rect x="35" y="12" width="6" height="28" rx="1" fill="url(#gf5)" />
      <defs>
        <linearGradient id="gf5" x1="35" y1="12" x2="41" y2="40">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AudienceIconAlgo() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M24 8v6M24 34v6M8 24h6M34 24h6" stroke="currentColor" className="text-indigo-400/70" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="10" stroke="url(#ga1)" strokeWidth="2" />
      <path d="M18 24l4 4 8-8" stroke="url(#ga1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="ga1" x1="14" y1="14" x2="34" y2="34">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AudienceIconAnalyst() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="22" cy="22" r="9" stroke="url(#ga2)" strokeWidth="2" />
      <path d="M30 30l8 8" stroke="url(#ga2)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 22h8M22 18v8" stroke="currentColor" className="text-indigo-300/60" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="ga2" x1="13" y1="13" x2="38" y2="38">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AudienceIconFintechDev() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="10" y="14" width="28" height="22" rx="3" stroke="url(#ga3)" strokeWidth="2" />
      <path d="M16 22h4M16 28h12" stroke="currentColor" className="text-indigo-300/50" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 20l4 4-4 4" stroke="url(#ga3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="ga3" x1="10" y1="14" x2="38" y2="36">
          <stop stopColor="#93c5fd" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AudienceIconQuant() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M10 32 L16 20 L22 28 L28 14 L34 24 L38 18"
        stroke="url(#ga4)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10h8M16 6v8"
        stroke="currentColor"
        className="text-fuchsia-300/80"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="ga4" x1="10" y1="14" x2="38" y2="32">
          <stop stopColor="#e879f9" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AudienceIconBot() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="12" y="16" width="24" height="18" rx="4" stroke="url(#ga5)" strokeWidth="2" />
      <circle cx="18" cy="25" r="2" fill="currentColor" className="text-indigo-300" />
      <circle cx="30" cy="25" r="2" fill="currentColor" className="text-indigo-300" />
      <path d="M20 32h8" stroke="currentColor" className="text-indigo-400/70" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 10v6M18 12h12" stroke="url(#ga5)" strokeWidth="1.8" strokeLinecap="round" />
      <defs>
        <linearGradient id="ga5" x1="12" y1="10" x2="36" y2="38">
          <stop stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const featureIconByKey = {
  historical: FeatureIconHistorical,
  api: FeatureIconApi,
  dev: FeatureIconDev,
  fast: FeatureIconFast,
  etf: FeatureIconEtf,
} as const;

export type FeatureIconKey = keyof typeof featureIconByKey;

export function FeatureFloatIcon({ iconKey, index }: { iconKey: FeatureIconKey; index: number }) {
  const Icon = featureIconByKey[iconKey];
  return (
    <FloatIcon delay={index * 0.35}>
      <Icon />
    </FloatIcon>
  );
}

export function AudienceCard({
  label,
  index,
  children,
}: {
  label: string;
  index: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      className="group relative flex min-w-[140px] flex-1 flex-col items-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] px-5 py-6 text-center sm:min-w-[160px] lg:max-w-[200px]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: index * 0.06 }}
      whileHover={{ y: -4, borderColor: "rgba(129, 140, 248, 0.35)" }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-violet-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 2.8 + index * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        >
          {children}
        </motion.div>
      </div>
      <p className="relative text-sm font-medium leading-snug text-white/90">{label}</p>
    </motion.div>
  );
}
