"use client";

import { useAuth } from "@/hooks/useAuth";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";
import { SiteHeader, SITE_HEADER_OFFSET } from "@/components/SiteHeader";
import { PRICING_PLANS } from "@/lib/mock-data";

export default function PricingPage() {
  const { isAuthenticated } = useAuth();

  const handleSelectPlan = (idOrSlug: string) => {
    if (!isAuthenticated) {
      window.location.href = `/auth/login?redirect=/pricing`;
      return;
    }
    if (idOrSlug === "free") return;
    window.location.href = `/dashboard/wallet?subscribe=${idOrSlug}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <SiteHeader active="pricing" isAuthenticated={isAuthenticated} />

      <section className={`px-4 pb-20 sm:px-6 lg:px-8 ${SITE_HEADER_OFFSET}`}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-center text-3xl font-bold sm:text-4xl">Simple pricing</h1>
          <p className="mx-auto mt-2 max-w-2xl text-center text-white/60">
            Start free with 50 requests/day. Upgrade to Starter for historical data, backtesting, and 1,000
            requests/day — no credit card required on the free tier.
          </p>

          <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/55">
            <strong className="text-white/80">Free:</strong> ETF list, batch prices, market status ·{" "}
            <strong className="text-indigo-300">Starter+:</strong> history, backtests, news, premium APIs
          </div>

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
