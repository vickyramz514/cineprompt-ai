"use client";

import Link from "next/link";
import { useUIStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import { useApiUsage } from "@/hooks/useApiUsage";
import DataCaptainLogo from "@/components/DataCaptainLogo";

export default function Navbar() {
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const { logout } = useAuth();
  const { stats } = useApiUsage();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 md:hidden"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <DataCaptainLogo size="sm" />
            <span className="text-xl font-semibold tracking-tight">
              Data <span className="text-indigo-400">Captain</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/usage"
            className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 hover:bg-white/10"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium">{stats?.requestsToday ?? 0}</span>
            <span className="text-xs text-white/50">today</span>
          </Link>
          <button
            onClick={logout}
            className="rounded-lg px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
