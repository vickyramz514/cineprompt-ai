"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type PremiumBlurSectionProps = {
  title: string;
  subtitle?: string;
  features: string[];
  children: ReactNode;
  primaryHref?: string;
  secondaryHref?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  tertiaryHref?: string;
  tertiaryLabel?: string;
  className?: string;
};

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function PremiumBlurSection({
  title,
  subtitle,
  features,
  children,
  primaryHref = "/dashboard/wallet",
  secondaryHref = "/pricing",
  primaryLabel = "Upgrade Now",
  secondaryLabel = "View Pricing",
  tertiaryHref,
  tertiaryLabel,
  className = "",
}: PremiumBlurSectionProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12] ${className}`}
    >
      <div className="pointer-events-none max-h-[min(68vh,640px)] overflow-hidden select-none blur-[6px] brightness-[0.72] saturate-75">
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0a0a12]/50 via-[#0a0a12]/75 to-[#0a0a12]/90 p-3 sm:p-5">
        <div className="flex max-h-[min(90%,620px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#12121c]/95 shadow-2xl shadow-violet-950/50 backdrop-blur-xl">
          {/* Header */}
          <div className="shrink-0 px-5 pt-5 text-center sm:px-7 sm:pt-6">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-500/25 to-indigo-500/20 text-violet-200">
              <LockIcon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-white sm:text-xl">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">{subtitle}</p>
            ) : null}
          </div>

          {/* Scrollable features only */}
          {features.length > 0 ? (
            <ul className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto px-5 sm:px-7">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-white/75">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-500/20 text-violet-300">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {/* Always-visible CTAs */}
          <div className="shrink-0 border-t border-white/10 bg-[#0e0e18]/95 px-5 py-4 sm:px-7">
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link
                href={primaryHref}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-500 hover:to-indigo-400"
              >
                {primaryLabel}
              </Link>
              {secondaryHref ? (
                <Link
                  href={secondaryHref}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10"
                >
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
            {tertiaryHref && tertiaryLabel ? (
              <Link
                href={tertiaryHref}
                className="mt-2.5 flex justify-center text-sm text-violet-300/90 underline-offset-4 hover:text-violet-200 hover:underline"
              >
                {tertiaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
