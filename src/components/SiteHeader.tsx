"use client";

import DataCaptainLogo from "@/components/DataCaptainLogo";
import { MarketingHeaderActions, type MarketingNavKey } from "@/components/MarketingHeaderActions";
import { SITE_HEADER_OFFSET } from "@/lib/brand";

type SiteHeaderProps = {
  active?: MarketingNavKey;
  isAuthenticated?: boolean;
  /** Constrain inner row width (docs-style pages) */
  contained?: boolean;
  containedMax?: string;
  sticky?: boolean;
};

export function SiteHeader({
  active = "home",
  isAuthenticated = false,
  contained = false,
  containedMax = "max-w-6xl",
  sticky = false,
}: SiteHeaderProps) {
  const position = sticky ? "sticky" : "fixed";

  return (
    <header
      className={`${position} top-0 left-0 right-0 z-50 border-b border-[var(--dc-border)] bg-[color-mix(in_srgb,var(--dc-bg)_80%,transparent)] backdrop-blur-xl`}
    >
      <div
        className={`flex items-center justify-between gap-4 px-4 py-2.5 lg:px-8 ${
          contained ? `mx-auto w-full ${containedMax}` : "w-full"
        }`}
      >
        <div className="flex min-w-0 shrink-0 items-center">
          <DataCaptainLogo variant="header" href="/" />
        </div>
        <MarketingHeaderActions active={active} isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}

export { SITE_HEADER_OFFSET };
