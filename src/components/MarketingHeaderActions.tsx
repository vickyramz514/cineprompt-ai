"use client";

import Link from "next/link";

const pill =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-all duration-200 hover:bg-white/[0.08] hover:text-white active:scale-[0.98]";

const loginBtn =
  "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-sm transition-all duration-200 hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white hover:shadow-[0_0_20px_-4px_rgba(99,102,241,0.45)] active:scale-[0.98]";

const primaryCta =
  "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_-4px_rgba(99,102,241,0.55)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_6px_28px_-4px_rgba(99,102,241,0.65)] active:scale-[0.98]";

const dashboardBtn =
  "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_-4px_rgba(99,102,241,0.55)] transition-all duration-200 hover:brightness-110 active:scale-[0.98]";

export type MarketingHeaderVariant = "landing" | "docs" | "pricing";

export function MarketingHeaderActions({
  variant,
  isAuthenticated = false,
}: {
  variant: MarketingHeaderVariant;
  isAuthenticated?: boolean;
}) {
  return (
    <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-1.5" aria-label="Main">
      <div className="mr-1 flex items-center rounded-full border border-white/[0.08] bg-black/30 p-1 backdrop-blur-md sm:mr-2">
        <Link href="/#product" className={`${pill} font-medium text-indigo-200/95 hover:text-white`}>
          Product
        </Link>
        {(variant === "landing" || variant === "pricing") && (
          <Link href="/docs" className={pill}>
            API Docs
          </Link>
        )}
        {(variant === "landing" || variant === "docs") && (
          <Link href="/pricing" className={pill}>
            Pricing
          </Link>
        )}
      </div>

      {variant === "pricing" && isAuthenticated ? (
        <Link href="/dashboard" className={dashboardBtn}>
          Dashboard
        </Link>
      ) : (
        <>
          <Link href="/auth/login" className={loginBtn}>
            Login
          </Link>
          <Link href="/auth/signup" className={primaryCta}>
            {variant === "docs" ? "Get API Key" : "Get Started"}
          </Link>
        </>
      )}
    </nav>
  );
}
