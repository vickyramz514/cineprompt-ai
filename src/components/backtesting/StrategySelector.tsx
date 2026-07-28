"use client";

import {
  BACKTEST_STRATEGIES,
  type BacktestStrategyId,
} from "@/lib/backtest/strategies";

export default function StrategySelector({
  value,
  onChange,
  params,
  onParamsChange,
}: {
  value: BacktestStrategyId;
  onChange: (id: BacktestStrategyId) => void;
  params: Record<string, number>;
  onParamsChange: (next: Record<string, number>) => void;
}) {
  const meta = BACKTEST_STRATEGIES.find((s) => s.id === value);

  return (
    <div className="space-y-3">
      <label className="block text-sm">
        <span className="text-white/50">Strategy</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as BacktestStrategyId)}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white focus:border-indigo-500/50 focus:outline-none"
        >
          {BACKTEST_STRATEGIES.map((s) => (
            <option key={s.id} value={s.id} disabled={!s.available}>
              {s.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-white/40">{meta?.description}</p>
      </label>

      {meta?.params && meta.params.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {meta.params.map((p) => (
            <label key={p.key} className="block text-xs">
              <span className="text-white/45">{p.label}</span>
              <input
                type="number"
                min={p.min}
                max={p.max}
                value={params[p.key] ?? p.defaultValue}
                onChange={(e) =>
                  onParamsChange({
                    ...params,
                    [p.key]: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm text-white focus:border-indigo-500/50 focus:outline-none"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
