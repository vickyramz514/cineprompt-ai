"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  datacaptainEndpoints,
  type EtfHeatmapCell,
  type EtfItem,
} from "@/services/datacaptain/endpoints";

type Props = {
  apiKey: string | null;
  value: string;
  onChange: (q: string) => void;
  onSelectSymbol: (symbol: string) => void;
  localCells: EtfHeatmapCell[];
  className?: string;
};

export default function HeatmapSearch({
  apiKey,
  value,
  onChange,
  onSelectSymbol,
  localCells,
  className = "",
}: Props) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [remote, setRemote] = useState<EtfItem[]>([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cacheRef = useRef<Map<string, EtfItem[]>>(new Map());
  const requestIdRef = useRef(0);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!apiKey) {
      setRemote([]);
      setLoading(false);
      return;
    }
    const q = value.trim();
    if (q.length < 1) {
      setRemote([]);
      setLoading(false);
      return;
    }

    const key = q.toLowerCase();
    const cached = cacheRef.current.get(key);
    if (cached) {
      setRemote(cached);
      setLoading(false);
      return;
    }

    const reqId = ++requestIdRef.current;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await datacaptainEndpoints.etfList(apiKey, {
          limit: "12",
          offset: "0",
          search: q,
          hasPrice: "1",
        });
        if (reqId !== requestIdRef.current) return;
        cacheRef.current.set(key, res.data);
        setRemote(res.data);
      } catch {
        if (reqId === requestIdRef.current) setRemote([]);
      } finally {
        if (reqId === requestIdRef.current) setLoading(false);
      }
    }, 280);

    return () => clearTimeout(handle);
  }, [apiKey, value]);

  const localMatches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return localCells
      .filter((c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((c) => ({
        symbol: c.symbol,
        name: c.name,
        price: c.latestPrice,
        exchange: null as string | null,
      }));
  }, [value, localCells]);

  const suggestions = useMemo(() => {
    const merged: EtfItem[] = [];
    const seen = new Set<string>();
    for (const etf of [...localMatches, ...remote]) {
      if (seen.has(etf.symbol)) continue;
      seen.add(etf.symbol);
      merged.push(etf);
    }
    return merged.slice(0, 12);
  }, [localMatches, remote]);

  useEffect(() => {
    setActiveIndex(suggestions.length ? 0 : -1);
  }, [suggestions]);

  const pick = (symbol: string) => {
    onSelectSymbol(symbol);
    setOpen(false);
  };

  const showPanel = open && value.trim().length > 0;

  return (
    <div ref={rootRef} className={`relative min-w-[180px] flex-1 sm:max-w-xs ${className}`}>
      <input
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (!showPanel && e.key === "ArrowDown" && value.trim()) {
            setOpen(true);
            return;
          }
          if (!showPanel) return;
          if (e.key === "Escape") {
            setOpen(false);
            return;
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % suggestions.length);
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
          }
          if (e.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
            e.preventDefault();
            pick(suggestions[activeIndex].symbol);
          }
        }}
        placeholder="Search ETF..."
        aria-label="Search ETF"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={showPanel}
        role="combobox"
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 pr-9 text-sm text-white placeholder:text-white/35 focus:border-violet-500/50 focus:outline-none"
      />
      {loading && (
        <span
          className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-white/20 border-t-violet-400"
          aria-hidden
        />
      )}

      {showPanel && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0b0b14] p-1.5 shadow-2xl"
        >
          {loading && suggestions.length === 0 && (
            <li className="px-3 py-2 text-xs text-white/45">Searching ETFs…</li>
          )}
          {!loading && suggestions.length === 0 && (
            <li className="px-3 py-2 text-xs text-white/45">No ETFs match your search</li>
          )}
          {suggestions.map((etf, i) => (
            <li key={etf.symbol} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(etf.symbol)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                  i === activeIndex ? "bg-violet-500/20 text-white" : "text-white/85 hover:bg-white/5"
                }`}
              >
                <span className="min-w-0">
                  <span className="font-mono font-semibold text-violet-200">{etf.symbol}</span>
                  <span className="mt-0.5 block truncate text-xs text-white/50">{etf.name}</span>
                </span>
                {etf.price != null && (
                  <span className="shrink-0 text-xs tabular-nums text-white/55">${etf.price.toFixed(2)}</span>
                )}
              </button>
            </li>
          ))}
          {!apiKey && (
            <li className="border-t border-white/10 px-3 py-2 text-[11px] text-amber-300/80">
              Add an API key to load live ETF suggestions.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
