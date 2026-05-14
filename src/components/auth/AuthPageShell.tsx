"use client";

import type { ReactNode } from "react";
import AuthMarketChartBackdrop from "@/components/landing/AuthMarketChartBackdrop";

export default function AuthPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      <AuthMarketChartBackdrop />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_88%_78%_at_50%_42%,rgba(10,10,15,0.58),rgba(10,10,15,0.9))]" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_100%_58%_at_50%_100%,rgba(99,102,241,0.13),transparent_52%)]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
