"use client";

import Link from "next/link";
import { useCreditsStore } from "@/store/useStore";
import { useUIStore } from "@/store/useStore";

export default function Navbar() {
  const credits = useCreditsStore((s) => s.credits);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

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
<Link href="/dashboard" className="text-xl font-semibold tracking-tight">
            CinePrompt <span className="text-indigo-400">AI</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm font-medium">{credits}</span>
            <span className="text-xs text-white/50">credits</span>
          </div>
        </div>
      </div>
    </header>
  );
}
