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
    title: "Market data",
    items: [
      { href: "/dashboard/tools/prices", label: "Batch Prices", icon: "prices" },
      { href: "/dashboard/etf", label: "ETF Explorer", icon: "etf" },
      { href: "/dashboard/options", label: "Options", icon: "options", premium: true },
      { href: "/dashboard/insiders", label: "Insiders", icon: "insiders", premium: true },
      { href: "/dashboard/darkpool", label: "Dark Pool", icon: "darkpool", premium: true },
      { href: "/dashboard/economy", label: "Economy", icon: "economy", premium: true },
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
