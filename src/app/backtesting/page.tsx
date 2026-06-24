import { MarketingShell } from "@/components/MarketingShell";
import BacktestingView from "@/components/dashboard/BacktestingView";
import Link from "next/link";

export const metadata = {
  title: "ETF Backtesting | Data Captain",
  description: "Run buy-and-hold backtests on US ETFs using Data Captain historical data.",
};

export default function BacktestingPage() {
  return (
    <MarketingShell active="backtesting">
      <BacktestingView />
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-indigo-500/5 p-6 text-center">
          <p className="text-sm text-white/60">
            Backtesting uses the same API key and database as our market data APIs.
          </p>
          <Link
            href="/dashboard/backtesting"
            className="mt-4 inline-flex rounded-xl bg-indigo-500/20 px-5 py-2.5 text-sm font-medium text-indigo-200 hover:bg-indigo-500/30"
          >
            Open in Dashboard →
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
