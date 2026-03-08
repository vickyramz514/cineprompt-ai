"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PRICING_PLANS } from "@/lib/mock-data";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";

const FEATURES = [
  {
    title: "25+ Years of Historical Market Data",
    desc: "Access daily historical prices for US stocks and ETFs from 2000 to present.",
  },
  {
    title: "Simple REST API",
    desc: "Fetch market data using simple endpoints with predictable JSON responses.",
  },
  {
    title: "Developer Friendly",
    desc: "Well documented endpoints, consistent schema, and easy authentication using API keys.",
  },
  {
    title: "Fast & Reliable",
    desc: "Optimized infrastructure designed for high performance data retrieval.",
  },
  {
    title: "ETF & Equity Coverage",
    desc: "Access historical data for thousands of equities and exchange traded funds.",
  },
];

const TARGET_USERS = [
  "Algorithmic traders",
  "Financial analysts",
  "Developers building fintech apps",
  "Quantitative researchers",
  "Trading bot developers",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="text-xl font-semibold">
          Stock Data <span className="text-indigo-400">API</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/docs" className="text-sm font-medium text-white/70 hover:text-white">
            API Docs
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-white/70 hover:text-white">
            Pricing
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            US Stock & ETF Historical Data API
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/70"
          >
            Access reliable historical market data for US equities and ETFs through a simple and fast REST API.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-4 max-w-2xl text-base text-white/60"
          >
            Our platform provides clean, structured historical market data for developers, traders, and financial analysts.
            Build trading algorithms, financial dashboards, research tools, and analytics platforms using our scalable API.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <Link
              href="/auth/signup"
              className="inline-flex rounded-xl bg-indigo-500 px-8 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-600 hover:shadow-indigo-500/30"
            >
              Get API Key
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Key Features */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-2xl font-semibold sm:text-3xl"
          >
            Key Features
          </motion.h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-6"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="border-t border-white/5 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-2xl font-semibold sm:text-3xl"
          >
            Built for
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto mt-2 max-w-xl text-center text-white/60"
          >
            This platform is designed for professionals who need reliable market data
          </motion.p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {TARGET_USERS.map((user, i) => (
              <motion.span
                key={user}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
              >
                {user}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">Simple pricing</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-white/60">
            Start free. Scale as you grow.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING_PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={{
                  id: plan.id,
                  name: plan.name,
                  price: plan.price,
                  credits: plan.requestsPerDay,
                  features: plan.features,
                }}
                popular={plan.id === "starter"}
                onSelect={() => (window.location.href = "/pricing")}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
