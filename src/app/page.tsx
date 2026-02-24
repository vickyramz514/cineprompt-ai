"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PRICING_PLANS } from "@/lib/mock-data";
import { NICHES } from "@/lib/niches";
import NicheCard from "@/components/NicheCard";
import PricingCard from "@/components/PricingCard";
import { useTemplateStore } from "@/store/useStore";

export default function LandingPage() {
  const setSelectedNiche = useTemplateStore((s) => s.setSelectedNiche);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="text-xl font-semibold">
          CinePrompt <span className="text-indigo-400">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/templates" className="text-sm font-medium text-white/70 hover:text-white">
            Templates
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

      {/* Hero - Template First */}
      <section className="relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Create stunning AI videos for weddings, business, festivals & social media — instantly.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/70"
          >
            Choose a template, customize text, and generate cinematic videos in seconds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <Link
              href="/templates"
              className="inline-flex rounded-xl bg-indigo-500 px-8 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-600 hover:shadow-indigo-500/30"
            >
              Explore Templates
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Niche Selection */}
      <section className="border-t border-white/5 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-2xl font-semibold sm:text-3xl"
          >
            Choose your niche
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto mt-2 max-w-xl text-center text-white/60"
          >
            Select a category to browse templates tailored for your use case
          </motion.p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {NICHES.map((niche, i) => (
              <motion.div
                key={niche.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/templates?niche=${niche.id}`}
                  onClick={() => setSelectedNiche(niche.id)}
                  className="block h-full"
                >
                  <NicheCard niche={niche} index={i} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow preview */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold">How it works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-4">
            {[
              { step: 1, title: "Select Niche", desc: "Pick your category" },
              { step: 2, title: "Pick Template", desc: "Choose from 50+ templates" },
              { step: 3, title: "Customize", desc: "Fill in your details" },
              { step: 4, title: "Generate", desc: "Download your video" },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                  {item.step}
                </span>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-semibold sm:text-3xl">Simple pricing</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-white/60">
            Choose the plan that fits your creative needs
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING_PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                popular={plan.id === "creator"}
                onSelect={() => {}}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-semibold">
            CinePrompt <span className="text-indigo-400">AI</span>
          </span>
          <div className="flex gap-6 text-sm text-white/60">
<Link href="/auth/login" className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">
            Login
          </Link>
            <Link href="/auth/signup" className="hover:text-white">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
