"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useUIStore, useAuthStore } from "@/store/useStore";
import { SIDEBAR_NAV } from "@/lib/mock-data";

const icons: Record<string, string> = {
  dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  create: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  templates: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  history: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  wallet: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
  profile: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  my: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
  favorites: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  notifications: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
};

const iconsAdmin = "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-16 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
      <aside className={`fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-white/5 bg-black/90 backdrop-blur-xl ${sidebarOpen ? "flex" : "hidden md:flex"}`}>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {SIDEBAR_NAV.map((item) => {
          const basePath = item.href.split("?")[0];
const itemTab = item.href.includes("tab=") ? new URL(item.href, "http://x").searchParams.get("tab") : null;
const currentTab = searchParams.get("tab");
const isActive = itemTab
  ? pathname === basePath && currentTab === itemTab
  : pathname === basePath || pathname.startsWith(basePath + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[item.icon] || icons.dashboard} />
              </svg>
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              pathname.startsWith("/admin")
                ? "bg-amber-500/20 text-amber-300"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconsAdmin} />
            </svg>
            Admin
          </Link>
        )}
      </nav>
    </aside>
    </>
  );
}
