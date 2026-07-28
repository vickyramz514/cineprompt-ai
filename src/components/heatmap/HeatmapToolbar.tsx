"use client";

import type { EtfHeatmapBasket, EtfHeatmapCell } from "@/services/datacaptain/endpoints";
import { PERIODS, SORT_OPTIONS, type HeatmapSort } from "@/lib/heatmap/stats";
import HeatmapSearch from "@/components/heatmap/HeatmapSearch";

type Props = {
  apiKey: string | null;
  localCells: EtfHeatmapCell[];
  baskets: EtfHeatmapBasket[];
  basketId: string;
  onBasket: (id: string) => void;
  period: string;
  onPeriod: (id: string) => void;
  sort: HeatmapSort;
  onSort: (s: HeatmapSort) => void;
  search: string;
  onSearch: (q: string) => void;
  onSelectSymbol: (symbol: string) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
};

export default function HeatmapToolbar({
  apiKey,
  localCells,
  baskets,
  basketId,
  onBasket,
  period,
  onPeriod,
  sort,
  onSort,
  search,
  onSearch,
  onSelectSymbol,
  filtersOpen,
  onToggleFilters,
}: Props) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <HeatmapSearch
          apiKey={apiKey}
          value={search}
          onChange={onSearch}
          onSelectSymbol={onSelectSymbol}
          localCells={localCells}
        />
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as HeatmapSort)}
          aria-label="Sort heatmap"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onToggleFilters}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 md:hidden"
        >
          {filtersOpen ? "Hide filters" : "Filters"}
        </button>
      </div>

      <div className={`${filtersOpen ? "block" : "hidden"} md:block`}>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/35">Category</p>
        <div className="flex flex-wrap gap-2">
          {(baskets.length ? baskets : [{ id: "broad", label: "Broad Market", symbols: [] }]).map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onBasket(b.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                basketId === b.id
                  ? "border-violet-500/50 bg-violet-500/20 text-violet-200"
                  : "border-white/10 bg-white/5 text-white/55 hover:border-white/20"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <p className="mb-2 mt-4 text-[10px] font-medium uppercase tracking-wider text-white/35">Period</p>
        <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPeriod(p.id)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                period === p.id ? "bg-violet-600 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
