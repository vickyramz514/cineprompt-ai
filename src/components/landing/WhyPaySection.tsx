"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const FREE_SITE_LIMITS = [
  "Manual research in a browser",
  "No API for your app or bot",
  "No backtests inside your product",
  "No portfolio rebalance automation",
  "Scattered tools, no single workflow",
];

const DATACAPTAIN_STARTER = [
  "ETF API — screener, rankings, heatmap, batch prices",
  "Backtesting & portfolio rebalance APIs",
  "1,000 requests/day for production apps",
  "TypeScript & Python SDKs (see docs)",
  "Same data in dashboard + your code",
];

export default function WhyPaySection() {
  return (
    <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-400/90">
            Why pay ₹1,500/month?
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            Free ETF websites are for reading.
            <br className="hidden sm:block" />
            <span className="text-white/70"> DataCaptain is for building.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/55">
            If you need ETF data inside your app, dashboard, or research pipeline — not another
            tab in Chrome — that is what Starter is for.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="font-semibold text-white/60">Free ETF websites</h3>
            <ul className="mt-4 space-y-3">
              {FREE_SITE_LIMITS.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-white/45">
                  <span className="text-white/25">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-transparent p-6 ring-1 ring-indigo-500/20">
            <h3 className="font-semibold text-indigo-200">DataCaptain Starter — ₹1,500/mo</h3>
            <ul className="mt-4 space-y-3">
              {DATACAPTAIN_STARTER.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-white/80">
                  <span className="text-emerald-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Start free, upgrade when you ship
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">
            Client libraries
          </p>
          <p className="mt-2 text-sm text-white/55">
            Official TypeScript and Python wrappers — install from the repo or copy from docs.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-sm">
              <code className="text-emerald-300">packages/datacaptain</code>
            </pre>
            <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-4 text-sm">
              <code className="text-emerald-300">packages/datacaptain-py</code>
            </pre>
          </div>
          <p className="mt-3 text-sm text-white/45">
            <Link href="/docs#sdks" className="text-indigo-400 hover:underline">
              SDK install & examples →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
