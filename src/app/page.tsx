"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PRICING_PLANS } from "@/lib/mock-data";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";
import DataCaptainLogo from "@/components/DataCaptainLogo";
import {
  AudienceCard,
  AudienceIconAlgo,
  AudienceIconAnalyst,
  AudienceIconBot,
  AudienceIconFintechDev,
  AudienceIconQuant,
  FeatureFloatIcon,
  type FeatureIconKey,
} from "@/components/landing/LandingAnimatedIcons";
import HeroMarketChartBackdrop from "@/components/landing/HeroMarketChartBackdrop";
import ProductShowcaseSection from "@/components/landing/ProductShowcaseSection";
import { PlatformPillars } from "@/components/MarketingShell";
import { MarketingHeaderActions } from "@/components/MarketingHeaderActions";

const FEATURES: { title: string; desc: string; icon: FeatureIconKey }[] = [
  {
    title: "25+ Years of Historical Market Data",
    desc: "Access daily historical prices for US stocks and ETFs from 2000 to present.",
    icon: "historical",
  },
  {
    title: "Simple REST API",
    desc: "Fetch market data using simple endpoints with predictable JSON responses.",
    icon: "api",
  },
  {
    title: "Developer Friendly",
    desc: "Well documented endpoints, consistent schema, and easy authentication using API keys.",
    icon: "dev",
  },
  {
    title: "Fast & Reliable",
    desc: "Optimized infrastructure designed for high performance data retrieval.",
    icon: "fast",
  },
  {
    title: "ETF & Equity Coverage",
    desc: "Access historical data for thousands of equities and exchange traded funds.",
    icon: "etf",
  },
];

const TARGET_USERS: { label: string; icon: ReactNode }[] = [
  { label: "Algorithmic traders", icon: <AudienceIconAlgo /> },
  { label: "Financial analysts", icon: <AudienceIconAnalyst /> },
  { label: "Developers building fintech apps", icon: <AudienceIconFintechDev /> },
  { label: "Quantitative researchers", icon: <AudienceIconQuant /> },
  { label: "Trading bot developers", icon: <AudienceIconBot /> },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0f]/70 px-4 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0f]/55 lg:px-8">
        <DataCaptainLogo size="md" />
        <MarketingHeaderActions active="home" />
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <HeroMarketChartBackdrop />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_85%_55%_at_50%_-5%,rgba(10,10,15,0.94),rgba(10,10,15,0.55)_42%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-indigo-900/[0.08] via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_65%_45%_at_50%_8%,rgba(99,102,241,0.16),transparent_62%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl [text-shadow:0_2px_40px_rgba(0,0,0,0.55)]"
          >
            US Stock & ETF Data Platform
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
            <Link
              href="/backtesting"
              className="ml-3 inline-flex rounded-xl border border-white/15 bg-white/5 px-8 py-3 font-semibold text-white/80 transition-all hover:bg-white/10"
            >
              Try Backtesting
            </Link>
          </motion.div>
        </div>
      </section>

      <ProductShowcaseSection />

      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">One platform, more than APIs</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-white/55">
            ETFs, stocks, backtesting, and portfolio tools — same login, same database, same API key.
          </p>
          <div className="mt-10">
            <PlatformPillars />
          </div>
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
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-indigo-500/25"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition-opacity group-hover:bg-indigo-500/15" />
                <FeatureFloatIcon iconKey={item.icon} index={i} />
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
          <div className="mt-12 flex flex-wrap justify-center gap-4 lg:gap-5">
            {TARGET_USERS.map((user, i) => (
              <AudienceCard key={user.label} label={user.label} index={i}>
                {user.icon}
              </AudienceCard>
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
                  currency: plan.currency,
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
