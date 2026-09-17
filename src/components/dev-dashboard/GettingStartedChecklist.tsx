"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "dc_getting_started_v2";

type StepId = "key" | "request" | "usage" | "paid";

const STEPS: {
  id: StepId;
  label: string;
  hint: string;
  href: string;
}[] = [
  {
    id: "key",
    label: "Create your API key",
    hint: "Keys are provisioned automatically — copy from API Keys",
    href: "/dashboard/api-keys",
  },
  {
    id: "request",
    label: "Make your first API request",
    hint: "Try the explorer or open any ETF widget on this dashboard",
    href: "/dashboard/api-explorer",
  },
  {
    id: "usage",
    label: "Check usage & remaining quota",
    hint: "See requests today and rate limits",
    href: "/dashboard/usage",
  },
  {
    id: "paid",
    label: "Unlock paid features",
    hint: "Historical OHLCV, backtests, and higher limits",
    href: "/dashboard/wallet",
  },
];

type Props = {
  hasKey: boolean;
  /** True when developer usage shows at least one request */
  hasMadeRequest: boolean;
  /** User is still on free plan */
  isFreePlan: boolean;
  /** Hide when fully done and dismissed */
  className?: string;
};

export default function GettingStartedChecklist({
  hasKey,
  hasMadeRequest,
  isFreePlan,
  className = "",
}: Props) {
  const [manual, setManual] = useState<Partial<Record<StepId, boolean>>>({});
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        manual?: Partial<Record<StepId, boolean>>;
        dismissed?: boolean;
      };
      setManual(parsed.manual ?? {});
      setDismissed(Boolean(parsed.dismissed));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: {
    manual: Partial<Record<StepId, boolean>>;
    dismissed: boolean;
  }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const done = useMemo(() => {
    return {
      key: hasKey || Boolean(manual.key),
      request: hasMadeRequest || Boolean(manual.request),
      usage: Boolean(manual.usage),
      paid: !isFreePlan || Boolean(manual.paid),
    } satisfies Record<StepId, boolean>;
  }, [hasKey, hasMadeRequest, isFreePlan, manual]);

  const completed = STEPS.filter((s) => done[s.id]).length;
  const allDone = completed === STEPS.length;

  if (dismissed && allDone) return null;

  const markUsageVisited = () => {
    const nextManual = { ...manual, usage: true };
    setManual(nextManual);
    persist({ manual: nextManual, dismissed });
  };

  const toggle = (id: StepId) => {
    // Auto steps can't be unchecked when backend says true
    if (id === "key" && hasKey) return;
    if (id === "request" && hasMadeRequest) return;
    if (id === "paid" && !isFreePlan) return;
    const nextManual = { ...manual, [id]: !done[id] };
    setManual(nextManual);
    persist({ manual: nextManual, dismissed });
  };

  const dismiss = () => {
    setDismissed(true);
    persist({ manual, dismissed: true });
  };

  return (
    <div
      className={`rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/10 via-[#0c0c14]/90 to-emerald-500/5 p-5 backdrop-blur-md ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-indigo-300/70">Onboarding</p>
          <h3 className="mt-0.5 text-lg font-semibold">Get to your first successful call</h3>
          <p className="mt-1 text-xs text-white/45">
            Key → request → usage → upgrade when you need history & backtests.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs tabular-nums text-white/45">
            {completed}/{STEPS.length}
          </span>
          {allDone ? (
            <button
              type="button"
              onClick={dismiss}
              className="text-xs text-white/40 hover:text-white/70"
            >
              Dismiss
            </button>
          ) : null}
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
          style={{ width: `${(completed / STEPS.length) * 100}%` }}
        />
      </div>
      <ul className="mt-4 space-y-3">
        {STEPS.map((s) => (
          <li key={s.id} className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => toggle(s.id)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px] ${
                done[s.id]
                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                  : "border-white/20 text-transparent"
              }`}
              aria-label={done[s.id] ? "Completed" : "Mark complete"}
            >
              ✓
            </button>
            <div className="min-w-0 flex-1">
              <Link
                href={s.href}
                onClick={() => {
                  if (s.id === "usage") markUsageVisited();
                }}
                className={`text-sm font-medium hover:underline ${
                  done[s.id] ? "text-white/45 line-through" : "text-white/85"
                }`}
              >
                {s.label}
              </Link>
              <p className="text-xs text-white/40">{s.hint}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
