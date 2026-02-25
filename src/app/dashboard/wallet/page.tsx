"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useCreditsStore } from "@/store/useStore";
import PricingCard from "@/components/PricingCard";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";
import * as subscriptionService from "@/services/subscription.service";
import * as walletService from "@/services/wallet.service";
import type { Plan } from "@/components/PricingCard";

function mapPlanToPricing(plan: {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  credits: number;
  features?: unknown;
}): Plan {
  return {
    id: plan.id,
    name: plan.name,
    price: Math.round(plan.priceCents / 100),
    credits: plan.credits,
    features: Array.isArray(plan.features) ? (plan.features as string[]) : [],
    slug: plan.slug,
  };
}

function formatType(type: string) {
  const map: Record<string, string> = {
    VIDEO_GENERATION: "Video generation",
    VIDEO_REFUND: "Refund",
    PURCHASE: "Purchase",
    SUBSCRIPTION: "Subscription",
    BONUS: "Bonus",
  };
  return map[type] || type;
}

export default function WalletPage() {
  const searchParams = useSearchParams();
  const { credits, fetchBalance } = useWallet();
  const { plans, isLoading: plansLoading, error: plansError } = useSubscriptionPlans();
  const { isLoading, error } = useCreditsStore();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [history, setHistory] = useState<walletService.CreditLedgerEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"credits" | "history">("credits");
  const [subscription, setSubscription] = useState<Awaited<ReturnType<typeof subscriptionService.getSubscriptionStatus>>>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await walletService.getHistory({ limit: 50 });
      setHistory(data.entries);
    } catch {
      // ignore
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const fetchSubscription = useCallback(async () => {
    try {
      const sub = await subscriptionService.getSubscriptionStatus();
      setSubscription(sub);
    } catch {
      setSubscription(null);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchSubscription();
  }, [fetchBalance, fetchSubscription]);

  useEffect(() => {
    if (activeTab === "history") fetchHistory();
  }, [activeTab, fetchHistory]);

  // Handle ?subscribe=starter from pricing page
  useEffect(() => {
    const subscribe = searchParams.get("subscribe");
    if (!subscribe || !plans.length) return;
    const plan = plans.find((p) => p.slug === subscribe || p.id === subscribe);
    if (plan && plan.priceCents > 0) {
      setSelectedPlan(mapPlanToPricing(plan));
      setPaymentModalOpen(true);
      window.history.replaceState({}, "", "/dashboard/wallet");
    }
  }, [searchParams, plans]);

  const handleSelectPlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId || p.slug === planId);
    if (!plan || plan.slug === "free") return;
    setSelectedPlan(mapPlanToPricing(plan));
    setCheckoutError(null);
    setPaymentModalOpen(true);
  };

  const handleRazorpayCheckout = async () => {
    if (!selectedPlan?.slug) return;

    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const { checkoutUrl } = await subscriptionService.createSubscription(selectedPlan.slug);
      setPaymentModalOpen(false);
      setSelectedPlan(null);
      window.location.href = checkoutUrl;
    } catch (err) {
      setCheckoutError(subscriptionService.getErrorMessage(err));
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.externalId) return;
    if (!confirm("Cancel your subscription? You'll keep access until the end of the billing period.")) return;

    setCancelling(true);
    try {
      await subscriptionService.cancelSubscription(subscription.externalId);
      await fetchSubscription();
    } catch {
      // Error toast
    } finally {
      setCancelling(false);
    }
  };

  const pricingPlans = plans.map(mapPlanToPricing).filter((p) => p.price > 0);

  if (isLoading && credits === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Wallet</h1>
      <p className="mt-1 text-white/60">Manage your credits and subscription</p>

      {(error || plansError) && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error || plansError}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">Available credits</p>
            <p className="text-4xl font-bold">{credits}</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <span className="text-2xl">💳</span>
          </div>
        </div>

        {subscription && subscription.status === "ACTIVE" && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Active plan</p>
                <p className="font-semibold">{subscription.plan.name}</p>
                <p className="text-xs text-white/50">
                  Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Cancel subscription"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab("credits")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "credits" ? "border-b-2 border-indigo-500 text-indigo-400" : "text-white/60"
          }`}
        >
          Add Credits
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "history" ? "border-b-2 border-indigo-500 text-indigo-400" : "text-white/60"
          }`}
        >
          Transaction History
        </button>
      </div>

      {activeTab === "credits" && (
        <>
          <h2 className="mt-8 text-xl font-semibold">Subscribe to a plan</h2>
          {plansLoading && pricingPlans.length === 0 ? (
            <div className="mt-6 flex justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pricingPlans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  popular={plan.name.toLowerCase() === "creator"}
                  onSelect={handleSelectPlan}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "history" && (
        <div className="mt-6">
          {historyLoading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : history.length === 0 ? (
            <p className="py-12 text-center text-white/50">No transactions yet</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Balance after</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/5">
                      <td className="px-4 py-3 text-white/70">
                        {new Date(entry.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{formatType(entry.type)}</td>
                      <td className={`px-4 py-3 ${entry.amount >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {entry.amount >= 0 ? "+" : ""}{entry.amount}
                      </td>
                      <td className="px-4 py-3 text-white/70">{entry.balanceAfter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setSelectedPlan(null);
          setCheckoutError(null);
        }}
        title="Complete payment"
      >
        <div className="space-y-4">
          <p className="text-sm text-white/60">
            Selected plan: {selectedPlan?.name} — {selectedPlan?.credits} credits/month
          </p>
          <p className="text-sm text-white/60">
            You will be redirected to Razorpay to complete the payment securely.
          </p>
          {checkoutError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {checkoutError}
            </div>
          )}
          <button
            onClick={handleRazorpayCheckout}
            disabled={checkoutLoading}
            className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {checkoutLoading ? "Redirecting..." : "Proceed to payment"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
