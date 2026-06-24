"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import AuthMarketChartBackdrop from "@/components/landing/AuthMarketChartBackdrop";
import DataCaptainLogo from "@/components/DataCaptainLogo";

const AUTH_LINKS = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "API Docs" },
  { href: "/backtesting", label: "Backtesting" },
];

export default function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      <AuthMarketChartBackdrop />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_88%_78%_at_50%_42%,rgba(10,10,15,0.58),rgba(10,10,15,0.9))]" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_100%_58%_at_50%_100%,rgba(99,102,241,0.13),transparent_52%)]" />

      <header className="fixed top-0 left-0 right-0 z-20 border-b border-white/[0.06] bg-[#0a0a0f]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <DataCaptainLogo variant="header" href="/" />
          <nav className="flex max-w-[60%] flex-wrap items-center justify-end gap-1 sm:max-w-none sm:gap-2" aria-label="Marketing">
            {AUTH_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-2.5 py-1.5 text-xs font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white sm:px-3 sm:py-2 sm:text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-12 pt-20">
        {children}
        <p className="mt-8 text-center text-sm text-white/45">
          <Link href="/" className="text-indigo-300/90 transition-colors hover:text-indigo-200 hover:underline">
            ← Back to landing page
          </Link>
        </p>
      </div>
    </div>
  );
}
