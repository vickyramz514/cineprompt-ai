/**
 * Dashboard sidebar navigation — grouped sections
 */

export type SidebarIcon =
  | "dashboard"
  | "docs"
  | "terminal"
  | "key"
  | "chart"
  | "prices"
  | "etf"
  | "options"
  | "insiders"
  | "darkpool"
  | "economy"
  | "snapshot"
  | "calendar"
  | "backtest"
  | "portfolio"
  | "usage"
  | "billing"
  | "referral"
  | "support"
  | "bell"
  | "profile";

export type SidebarNavItem = {
  href: string;
  label: string;
  icon: SidebarIcon;
  /** Shown with lock on free plan */
  premium?: boolean;
};

export type SidebarSection = {
  title: string;
  items: SidebarNavItem[];
};

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: "dashboard" }],
  },
  {
    title: "API",
    items: [
      { href: "/dashboard/api-docs", label: "API Docs", icon: "docs" },
      { href: "/dashboard/api-explorer", label: "API Explorer", icon: "terminal" },
      { href: "/dashboard/api-keys", label: "API Keys", icon: "key" },
      { href: "/dashboard/usage", label: "Usage", icon: "usage" },
    ],
  },
  {
    title: "Platform",
    items: [
      { href: "/dashboard/backtesting", label: "Backtesting", icon: "backtest", premium: true },
      { href: "/dashboard/portfolio", label: "Portfolio Tools", icon: "portfolio", premium: true },
    ],
  },
  {
    title: "Market data",
    items: [
      { href: "/dashboard/etf/heatmap", label: "ETF Heatmap", icon: "chart" },
      { href: "/dashboard/etf/screener", label: "ETF Screener", icon: "chart" },
      { href: "/dashboard/tools/prices", label: "Batch ETF Prices", icon: "prices" },
      { href: "/dashboard/etf", label: "ETF Explorer", icon: "etf" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/dashboard/wallet", label: "Billing", icon: "billing" },
      { href: "/dashboard/referral", label: "Referrals", icon: "referral" },
      { href: "/dashboard/support", label: "Support", icon: "support" },
      { href: "/dashboard/notifications", label: "Notifications", icon: "bell" },
      { href: "/dashboard/profile", label: "Profile", icon: "profile" },
    ],
  },
];

/** @deprecated Use SIDEBAR_SECTIONS */
export const SIDEBAR_NAV = SIDEBAR_SECTIONS.flatMap((s) => s.items);
