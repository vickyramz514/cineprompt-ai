"use client";

import Link from "next/link";

const pill =
  "inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-white/75 transition-all duration-200 hover:bg-white/[0.08] hover:text-white sm:px-4";

const pillActive =
  "inline-flex items-center justify-center rounded-full bg-indigo-500/20 px-3 py-2 text-sm font-medium text-indigo-200 sm:px-4";

const loginBtn =
  "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition-all hover:border-indigo-400/40 hover:bg-indigo-500/10 sm:px-5";

const primaryCta =
  "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_-4px_rgba(99,102,241,0.55)] transition-all hover:brightness-110 sm:px-5";

const dashboardBtn =
  "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white sm:px-5";

export type MarketingNavKey = "home" | "apis" | "backtesting" | "portfolio" | "pricing" | "docs";

/** @deprecated use MarketingNavKey */
export type MarketingHeaderVariant = "landing" | "docs" | "pricing";

const NAV: { key: MarketingNavKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "apis", label: "APIs", href: "/docs" },
  { key: "backtesting", label: "Backtesting", href: "/backtesting" },
  { key: "portfolio", label: "Portfolio", href: "/portfolio" },
  { key: "pricing", label: "Pricing", href: "/pricing" },
  { key: "docs", label: "Blog", href: "/blog" },
];

export function MarketingHeaderActions({
  active = "home",
  isAuthenticated = false,
  /** @deprecated ignored — use `active` */
  variant: _variant,
}: {
  active?: MarketingNavKey;
  isAuthenticated?: boolean;
  variant?: MarketingHeaderVariant;
}) {
  return (
    <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-1.5" aria-label="Main">
      <div className="mr-1 hidden items-center rounded-full border border-white/[0.08] bg-black/30 p-1 backdrop-blur-md md:flex sm:mr-2">
        {NAV.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={active === item.key ? pillActive : pill}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {isAuthenticated ? (
        <Link href="/dashboard" className={dashboardBtn}>
          Dashboard
        </Link>
      ) : (
        <>
          <Link href="/auth/login" className={loginBtn}>
            Login
          </Link>
          <Link href="/auth/signup" className={primaryCta}>
            Get Started
          </Link>
        </>
      )}
    </nav>
  );
}
