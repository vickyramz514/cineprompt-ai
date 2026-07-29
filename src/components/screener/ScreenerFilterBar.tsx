"use client";

import {
  CATEGORY_OPTIONS,
  ISSUER_OPTIONS,
  QUICK_PRESETS,
  type ScreenerFilters,
} from "@/lib/screener/presets";

type Props = {
  filters: ScreenerFilters;
  onChange: (next: ScreenerFilters) => void;
  onApplyPreset: (partial: Partial<ScreenerFilters>) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  searching?: boolean;
};

export default function ScreenerFilterBar({
  filters,
  onChange,
  onApplyPreset,
  filtersOpen,
  onToggleFilters,
  searching,
}: Props) {
  const set = <K extends keyof ScreenerFilters>(key: K, value: ScreenerFilters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1 sm:max-w-md">
          <input
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Search ETFs..."
            aria-label="Search ETFs"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 pr-9 text-sm text-white placeholder:text-white/35 focus:border-cyan-500/50 focus:outline-none"
          />
          {searching ? (
            <span
              className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400"
              aria-label="Searching"
            />
          ) : filters.search ? (
            <button
              type="button"
              onClick={() => set("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-white/40 hover:text-white/80"
              aria-label="Clear search"
            >
              ✕
            </button>
          ) : null}
        </div>
        <select
          value={filters.period}
          onChange={(e) => set("period", e.target.value)}
          aria-label="Return period"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white"
        >
          <option value="ytd">YTD</option>
          <option value="1y">1 Year</option>
          <option value="3y">3 Year</option>
          <option value="5y">5 Year</option>
        </select>
        <button
          type="button"
          onClick={onToggleFilters}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 lg:hidden"
        >
          {filtersOpen ? "Hide filters" : "Filters"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onApplyPreset(p.filters)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65 transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-white"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <label className="text-xs text-white/45">
            Category
            <select
              value={filters.category}
              onChange={(e) => set("category", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.id || "all"} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-white/45">
            Issuer
            <select
              value={filters.issuer}
              onChange={(e) => set("issuer", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            >
              {ISSUER_OPTIONS.map((o) => (
                <option key={o || "all"} value={o}>
                  {o || "All issuers"}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-white/45">
            Min return %
            <input
              type="number"
              step="0.1"
              value={filters.returnMin}
              onChange={(e) => set("returnMin", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-white/45">
            Max return %
            <input
              type="number"
              step="0.1"
              value={filters.returnMax}
              onChange={(e) => set("returnMax", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-white/45">
            Min dividend %
            <input
              type="number"
              step="0.1"
              value={filters.dividendYieldMin}
              onChange={(e) => set("dividendYieldMin", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-white/45">
            Max volatility %
            <input
              type="number"
              step="0.1"
              value={filters.volatilityMax}
              onChange={(e) => set("volatilityMax", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-white/45">
            Max expense %
            <input
              type="number"
              step="0.01"
              value={filters.expenseMax}
              onChange={(e) => set("expenseMax", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-white/45">
            Min AUM ($B)
            <input
              type="number"
              step="1"
              value={filters.aumMin}
              onChange={(e) => set("aumMin", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-white/45">
            Min Sharpe
            <input
              type="number"
              step="0.1"
              value={filters.sharpeMin}
              onChange={(e) => set("sharpeMin", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-white/45">
            Min volume
            <input
              type="number"
              step="1000"
              value={filters.volumeMin}
              onChange={(e) => set("volumeMin", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-white/45">
            Price min
            <input
              type="number"
              step="1"
              value={filters.priceMin}
              onChange={(e) => set("priceMin", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
          </label>
          <label className="text-xs text-white/45">
            Price max
            <input
              type="number"
              step="1"
              value={filters.priceMax}
              onChange={(e) => set("priceMax", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/70">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.leveraged}
              onChange={(e) => set("leveraged", e.target.checked)}
              className="rounded border-white/20"
            />
            Leveraged
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.inverse}
              onChange={(e) => set("inverse", e.target.checked)}
              className="rounded border-white/20"
            />
            Inverse
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.esg}
              onChange={(e) => set("esg", e.target.checked)}
              className="rounded border-white/20"
            />
            ESG
          </label>
        </div>
      </div>
    </div>
  );
}
