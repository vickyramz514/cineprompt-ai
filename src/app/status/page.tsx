"use client";

import { useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { SiteHeader, SITE_HEADER_OFFSET } from "@/components/SiteHeader";
import { usePlatformStatus } from "@/hooks/usePlatformStatus";
import { SUPPORT_EMAIL, mailtoSupport } from "@/lib/site";

function StatusDot({ status }: { status: "operational" | "degraded" | "down" }) {
  const colors = {
    operational: "bg-emerald-400 shadow-emerald-400/50",
    degraded: "bg-amber-400 shadow-amber-400/50",
    down: "bg-red-400 shadow-red-400/50",
  };
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full shadow-[0_0_8px] ${colors[status]}`}
      aria-hidden
    />
  );
}

function statusLabel(status: "operational" | "degraded" | "down") {
  if (status === "operational") return "All systems operational";
  if (status === "degraded") return "Partial degradation";
  return "Service disruption";
}

export default function StatusPage() {
  const { status, loading, error, refresh } = usePlatformStatus(60_000);

  useEffect(() => {
    document.title = "System status — Data Captain";
  }, []);

  const overall = status?.status ?? (error ? "down" : "operational");

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <SiteHeader active="home" contained containedMax="max-w-4xl" sticky />

      <main className={`mx-auto max-w-4xl px-4 pb-20 sm:px-6 ${SITE_HEADER_OFFSET}`}>
        <div className="pt-10">
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-300/80">Trust</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">System status</h1>
          <p className="mt-2 max-w-2xl text-white/55">
            Live health of the Data Captain API and market data pipeline. Refreshes every minute.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <StatusDot status={overall} />
              <div>
                <p className="text-lg font-semibold text-white">{statusLabel(overall)}</p>
                {status?.checkedAt && (
                  <p className="text-xs text-white/40">
                    Last checked {new Date(status.checkedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={loading}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 disabled:opacity-50"
            >
              {loading ? "Checking…" : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {status && (
            <>
              <div className="mt-6 space-y-3">
                {status.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <StatusDot status={service.status} />
                      <div>
                        <p className="font-medium text-white">{service.name}</p>
                        <p className="text-sm text-white/50">{service.message}</p>
                      </div>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-white/35">
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-wider text-white/35">Latest price date</p>
                  <p className="mt-1 font-mono text-lg text-emerald-300">
                    {status.data.latestPriceDate || "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-wider text-white/35">ETF metrics as of</p>
                  <p className="mt-1 font-mono text-lg text-indigo-300">
                    {status.data.etfMetricsAsOf || "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-wider text-white/35">US instruments</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                    {status.data.etfCount?.toLocaleString() ?? "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-wider text-white/35">Historical rows</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                    {status.data.historicalPriceRows?.toLocaleString() ?? "—"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-white/55">
          <p>
            Need help? Email{" "}
            <a href={mailtoSupport("Data Captain support")} className="text-indigo-400 hover:underline">
              {SUPPORT_EMAIL}
            </a>{" "}
            — we typically respond within one business day.
          </p>
          <p className="mt-3">
            <Link href="/pricing" className="text-indigo-400 hover:underline">
              View pricing →
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
