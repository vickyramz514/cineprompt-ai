"use client";

import Link from "next/link";

type Props = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
};

/** Guided empty state for dashboard widgets. */
export default function DashboardEmptyState({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className = "",
}: Props) {
  return (
    <div
      className={`rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-center ${className}`}
    >
      <p className="text-sm font-medium text-white/80">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-white/45">{description}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {primaryHref && primaryLabel ? (
          <Link
            href={primaryHref}
            className="rounded-lg bg-indigo-500/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            {primaryLabel}
          </Link>
        ) : null}
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/5"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
