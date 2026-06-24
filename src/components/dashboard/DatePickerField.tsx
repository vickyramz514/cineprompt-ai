"use client";

import { BACKTEST_MIN_DATE, todayDateInput } from "@/lib/date-utils";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  className?: string;
};

const fieldClass =
  "date-picker-field w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-white focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

export default function DatePickerField({
  label,
  value,
  onChange,
  min = BACKTEST_MIN_DATE,
  max = todayDateInput(),
  className = "",
}: Props) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="text-white/50">{label}</span>
      <div className="relative mt-1.5">
        <input
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className={fieldClass}
        />
      </div>
    </label>
  );
}
