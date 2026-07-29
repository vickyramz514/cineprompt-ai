"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadFavorites } from "@/lib/screener/storage";

export default function FavoriteEtfsStrip() {
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    setFavs(loadFavorites());
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">Favorites</p>
          <h3 className="mt-0.5 text-lg font-semibold">Saved ETFs</h3>
        </div>
        <Link href="/dashboard/etf/screener?favorites=1" className="text-xs text-amber-300/90 hover:underline">
          Manage →
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {favs.length ? (
          favs.slice(0, 16).map((s) => (
            <Link
              key={s}
              href={`/dashboard/etf/${s}`}
              className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 font-mono text-xs text-amber-100 hover:bg-amber-500/20"
            >
              ★ {s}
            </Link>
          ))
        ) : (
          <p className="text-xs text-white/40">
            Star ETFs in Screener or Rankings to pin them here.
          </p>
        )}
      </div>
    </div>
  );
}
