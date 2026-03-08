"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";
import { PRICING_PLANS } from "@/lib/mock-data";

export default function PricingPage() {
  const { isAuthenticated } = useAuth();

  const handleSelectPlan = (idOrSlug: string) => {
    if (idOrSlug === "enterprise") {
      window.location.href = "mailto:sales@stockdata.example.com?subject=Enterprise%20Plan%20Inquiry";
      return;
    }
    if (!isAuthenticated) {
      window.location.href = `/auth/login?redirect=/pricing`;
      return;
    }
    if (idOrSlug === "free") return;
    window.location.href = `/dashboard/wallet?subscribe=${idOrSlug}`;
  };

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
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-center text-3xl font-bold sm:text-4xl">Simple pricing</h1>
          <p className="mx-auto mt-2 max-w-xl text-center text-white/60">
            Choose the plan that fits your API usage. All plans include historical stock and ETF data.
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
                onSelect={(id) => handleSelectPlan(id)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
