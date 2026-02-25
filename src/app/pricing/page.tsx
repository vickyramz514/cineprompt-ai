"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import PricingCard from "@/components/PricingCard";
import Loader from "@/components/Loader";
import * as subscriptionService from "@/services/subscription.service";
import type { SubscriptionPlan } from "@/services/subscription.service";

function mapPlanToPricing(plan: SubscriptionPlan) {
  return {
    id: plan.id,
    name: plan.name,
    price: Math.round(plan.priceCents / 100),
    credits: plan.credits,
    features: Array.isArray(plan.features) ? (plan.features as string[]) : [],
    slug: plan.slug,
  };
}

type PlanWithSlug = ReturnType<typeof mapPlanToPricing>;

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<PlanWithSlug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    subscriptionService
      .getPlans()
      .then((data) => setPlans(data.map(mapPlanToPricing)))
      .catch((err) => setError(subscriptionService.getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectPlan = (idOrSlug: string) => {
    if (!isAuthenticated) {
      window.location.href = `/auth/login?redirect=/pricing`;
      return;
    }
    const plan = plans.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!plan || plan.price === 0) return;
    window.location.href = `/dashboard/wallet?subscribe=${plan.slug || plan.id}`;
  };

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
            Choose the plan that fits your creative needs. All plans include 1080p output.
          </p>

          {error && (
            <div className="mx-auto mt-8 max-w-md rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-red-400">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="mt-16 flex justify-center py-20">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  popular={plan.name.toLowerCase() === "creator"}
                  onSelect={(id) => handleSelectPlan(id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-white/5 px-4 py-12">
        <div className="mx-auto flex max-w-6xl justify-center">
          <Link href="/" className="text-sm text-white/60 hover:text-white">
            ← Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
