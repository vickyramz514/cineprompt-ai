"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/lib/api-docs-data";

const stats = [
  { value: "ETF", label: "Focused data", detail: "US exchange-traded funds" },
  { value: "REST + WS", label: "One platform", detail: "HTTP & WebSocket" },
  { value: "Free tier", label: "Start at $0", detail: "No card required" },
  { value: "Swagger", label: "Live docs", detail: "Try requests in-browser" },
];

const offerings = [
  {
    title: "ETF prices & history",
    description:
      "Batch ETF quotes and historical series for backtests — structured JSON you can trust for apps and research.",
    tag: "Core data",
    span: "md:col-span-7",
    accent: "from-indigo-500/20 to-transparent",
  },
  {
    title: "Backtesting",
    description: "Buy-and-hold simulations with CAGR, drawdown, dividend yield, and equity curves on ETF history.",
    tag: "Platform",
    span: "md:col-span-5",
    accent: "from-violet-500/20 to-transparent",
  },
  {
    title: "ETF universe",
    description:
      "Paginated ETF list with search — symbol-level details and batch pricing for your watchlists and screeners.",
    tag: "Coverage",
    span: "md:col-span-5",
    accent: "from-fuchsia-500/15 to-transparent",
  },
  {
    title: "Built for shipping",
    description:
      "API key auth, predictable routes, OpenAPI/Swagger, and generous limits so your team ships dashboards and quant pipelines faster.",
    tag: "DX",
    span: "md:col-span-7",
    accent: "from-cyan-500/15 to-transparent",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 26 },
  },
};

export default function ProductShowcaseSection() {
  return (
    <section
      id="product"
      className="scroll-mt-28 border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-400/90">
            Product
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Everything you need to build with{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-white to-violet-300 bg-clip-text text-transparent">
              US ETF data
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/65">
            One API for ETF historical depth, batch pricing, and backtesting—designed so your
            users see polished charts, not broken pipes.
          </p>
        </motion.div>

        <motion.ul
          className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {stats.map((s) => (
            <motion.li
              key={s.label}
              variants={item}
              className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-4 py-4 text-center"
            >
              <p className="text-lg font-semibold text-white sm:text-xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-white/80">{s.label}</p>
              <p className="mt-0.5 text-[11px] text-white/45">{s.detail}</p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="mt-10 grid gap-4 md:grid-cols-12 md:gap-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {offerings.map((o) => (
            <motion.article
              key={o.title}
              variants={item}
              className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d14] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] ${o.span}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${o.accent} opacity-70 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div className="relative">
                <span className="inline-block rounded-full border border-indigo-400/25 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-indigo-300/95">
                  {o.tag}
                </span>
                <h3 className="mt-3 text-xl font-semibold text-white">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{o.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="relative mt-10 overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#12121c] to-[#0a0a12] p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">Try it in seconds</h3>
              <p className="mt-2 text-sm text-white/55">
                Sign up, copy your key, and call the API. Our docs mirror production so what you read
                is what you run.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/auth/signup"
                  className="inline-flex rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_-4px_rgba(99,102,241,0.55)] transition hover:brightness-110"
                >
                  Get API key
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex rounded-full border border-white/15 bg-white/[0.05] px-6 py-2.5 text-sm font-medium text-white transition hover:border-indigo-400/35 hover:bg-white/[0.08]"
                >
                  Read the docs
                </Link>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-xl border border-white/[0.08] bg-black/50 p-4 text-left text-[11px] leading-relaxed text-white/80 shadow-inner sm:text-xs">
              <code>
                <span className="text-violet-400">curl</span>{" "}
                <span className="text-white/50">-H</span>{" "}
                <span className="text-emerald-400/90">&quot;x-api-key: YOUR_KEY&quot;</span> \
                {"\n"}
                {`  `}
                <span className="text-indigo-300/90">{API_BASE_URL}/api/etf/list?search=SPY&limit=10</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
