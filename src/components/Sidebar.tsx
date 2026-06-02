"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore, useAuthStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { useApiUsage } from "@/hooks/useApiUsage";
import { SIDEBAR_SECTIONS, type SidebarIcon } from "@/lib/sidebar-nav";
import { usePlanAccess } from "@/hooks/usePlanAccess";
import DataCaptainLogo from "@/components/DataCaptainLogo";

const ICON_PATHS: Record<SidebarIcon, string> = {
  dashboard:
    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  docs: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  terminal: "M8 9l3 3-3 3m5 0h3M5 5h14v14H5V5z",
  key: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499a1.875 1.875 0 011.591-.659H9.75V6.75a3 3 0 013-3h3z",
  chart: "M7 12l3-3 3 3 4-4M3 20h18",
  prices: "M4 18V8M10 18V4M16 18v-6M22 18V10",
  etf: "M4 6h16M4 12h10M4 18h6M4 4h16v16H4V4z",
  options: "M7 16V8m5 8V4m5 12v-6M3 20h18",
  insiders:
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  darkpool:
    "M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1",
  economy:
    "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
  usage: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  billing:
    "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  referral:
    "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  support:
    "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
  bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  profile:
    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
};

const ADMIN_PATH =
  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z";

function NavIcon({ name, active }: { name: SidebarIcon; active: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
        active
          ? "bg-indigo-500/25 text-indigo-300"
          : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white/80"
      }`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
      </svg>
    </span>
  );
}

function useNavActive(href: string) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = href.split("?")[0];
  const itemTab = href.includes("tab=") ? new URL(href, "http://x").searchParams.get("tab") : null;
  const currentTab = searchParams.get("tab");

  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  if (itemTab) {
    return pathname === basePath && currentTab === itemTab;
  }
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function NavLink({
  href,
  label,
  icon,
  premium,
  locked,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: SidebarIcon;
  premium?: boolean;
  locked?: boolean;
  onNavigate: () => void;
}) {
  const isActive = useNavActive(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group relative flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors ${
        isActive ? "text-white" : locked ? "text-white/40 hover:text-white/65" : "text-white/55 hover:text-white/90"
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      {isActive && (
        <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-indigo-400" />
      )}
      <span className="relative">
        <NavIcon name={icon} active={isActive} />
      </span>
      <span className="relative flex min-w-0 flex-1 items-center justify-between gap-2 truncate">
        <span className="truncate">{label}</span>
        {premium && locked && (
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5 shrink-0 text-amber-400/80"
            aria-label="Paid plan required"
          >
            <path
              fillRule="evenodd"
              d="M10 1a4.5 4.5 0 0 0-2.45 8.26v2.07a1 1 0 0 0 .55.9l3.5 1.75a1 1 0 0 0 .9 0l3.5-1.75a1 1 0 0 0 .55-.9v-2.07A4.5 4.5 0 0 0 10 1Zm2.45 6.76a2.45 2.45 0 1 0-4.9 0 2.45 2.45 0 0 0 4.9 0ZM8.26 12.74v1.52l1.74.87 1.74-.87v-1.52H8.26Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    </Link>
  );
}

function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0c0c14]/90 text-white/80 shadow-lg shadow-black/40 backdrop-blur-md md:hidden"
      aria-label="Open menu"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </motion.button>
  );
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const { stats } = useApiUsage();
  const { isFree } = usePlanAccess();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const pathname = usePathname();

  const closeMobile = () => setSidebarOpen(false);
  const openMobile = () => setSidebarOpen(true);

  return (
    <>
      <AnimatePresence>
        {!sidebarOpen && <MobileMenuButton key="menu-fab" onClick={openMobile} />}
      </AnimatePresence>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[17.5rem] flex-col border-r border-white/10 bg-[#08080e]/98 backdrop-blur-xl transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Header: logo + close (mobile) */}
        <div className="relative border-b border-white/10 bg-gradient-to-b from-indigo-500/10 to-transparent px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <DataCaptainLogo size="sm" href="/dashboard" />
            <button
              type="button"
              onClick={closeMobile}
              className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <Link
            href="/dashboard/usage"
            onClick={closeMobile}
            className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 transition-colors hover:bg-emerald-500/15"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm font-medium tabular-nums">{stats?.requestsToday ?? 0}</span>
            <span className="text-xs text-white/45">requests today</span>
          </Link>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 py-4">
          {SIDEBAR_SECTIONS.map((section, si) => (
            <div key={section.title} className={si > 0 ? "mt-6" : ""}>
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                {section.title}
              </p>
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      {...item}
                      locked={Boolean(item.premium && isFree)}
                      onNavigate={closeMobile}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {isAdmin && (
            <div className="mt-6 border-t border-white/5 pt-4">
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                Admin
              </p>
              <Link
                href="/admin/dashboard"
                onClick={closeMobile}
                className={`group relative flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors ${
                  pathname.startsWith("/admin")
                    ? "text-amber-200"
                    : "text-white/55 hover:text-white/90"
                }`}
              >
                {pathname.startsWith("/admin") && (
                  <motion.span
                    layoutId="sidebar-active-admin"
                    className="absolute inset-0 rounded-xl border border-amber-500/25 bg-amber-500/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    pathname.startsWith("/admin")
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-white/5 text-white/50 group-hover:bg-white/10"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={ADMIN_PATH} />
                  </svg>
                </span>
                <span className="relative">Admin panel</span>
              </Link>
            </div>
          )}
        </nav>

        {user && (
          <div className="relative shrink-0 border-t border-white/10 bg-gradient-to-t from-black/50 to-transparent p-3">
            <Link
              href="/dashboard/profile"
              onClick={closeMobile}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-colors hover:border-white/10 hover:bg-white/[0.05]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/35 to-violet-600/20 text-sm font-semibold text-indigo-100 ring-1 ring-indigo-500/20">
                {(user.name?.[0] || user.email?.[0] || "?").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{user.name || "Developer"}</p>
                <p className="truncate text-xs text-white/45">{user.email}</p>
                {user.plan && (
                  <span className="mt-1 inline-block rounded-md bg-indigo-500/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-indigo-300/90">
                    {user.plan}
                  </span>
                )}
              </div>
              <svg
                className="h-4 w-4 shrink-0 text-white/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={() => logout()}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/75 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
