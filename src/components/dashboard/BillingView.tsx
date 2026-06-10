"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/hooks/useWallet";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useAuthStore, useCreditsStore } from "@/store/useStore";
import { useApiUsage } from "@/hooks/useApiUsage";
import PricingCard from "@/components/PricingCard";
import Modal from "@/components/Modal";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import * as subscriptionService from "@/services/subscription.service";
import * as walletService from "@/services/wallet.service";
import { openRazorpaySubscriptionCheckout } from "@/lib/razorpayCheckout";
import type { Plan } from "@/components/PricingCard";

function mapPlanToPricing(plan: {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  credits: number;
  currency: string;
  features?: unknown;
}): Plan {
  const price = plan.priceCents < 0 ? -1 : Math.round(plan.priceCents / 100);
  const credits = plan.credits < 0 ? 0 : plan.credits;
  return {
    id: plan.id,
    name: plan.name,
    price,
    credits,
    features: Array.isArray(plan.features) ? (plan.features as string[]) : [],
    slug: plan.slug,
    currency: plan.currency,
  };
}

function formatType(type: string) {
  const map: Record<string, string> = {
    API_REQUEST: "API request",
    VIDEO_GENERATION: "API usage",
    VIDEO_REFUND: "Refund",
    PURCHASE: "Purchase",
    SUBSCRIPTION: "Subscription",
    BONUS: "Bonus",
  };
  return map[type] || type;
}

const TX_ICONS: Record<string, string> = {
  SUBSCRIPTION: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  PURCHASE: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25c.621 0 1.125.504 1.125 1.125v.375m-19.5 0h19.5m-19.5 0l1.409 12.294A1.125 1.125 0 004.126 18h15.748a1.125 1.125 0 001.123-1.106L22.5 6",
  default: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
};

export default function BillingView() {
  const searchParams = useSearchParams();
  const { credits, fetchBalance } = useWallet();
  const { refetch: refetchUsage } = useApiUsage();
  const setUser = useAuthStore((s) => s.setUser);
  const { plans, isLoading: plansLoading, error: plansError } = useSubscriptionPlans();
  const { isLoading, error } = useCreditsStore();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [history, setHistory] = useState<walletService.CreditLedgerEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"plans" | "history">("plans");
  const [subscription, setSubscription] = useState<Awaited<ReturnType<typeof subscriptionService.getSubscriptionStatus>>>(null);
  const [cancelling, setCancelling] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const formatMonthlyPrice = (amount: number, currency?: string) => {
    const code = (currency || "USD").toUpperCase();
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${code} ${amount}`;
    }
  };

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await walletService.getHistory({ limit: 50 });
      setHistory(data.entries);
    } catch {
      setHistory([]);
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

  useEffect(() => {
    const paymentId = searchParams.get("razorpay_payment_id");
    const subscriptionId = searchParams.get("razorpay_subscription_id");
    if (!paymentId && !subscriptionId) return;

    let cancelled = false;

    const syncAfterCheckout = async () => {
      try {
        if (subscriptionId) {
          const confirmed = await subscriptionService.confirmSubscription(subscriptionId);
          if (!cancelled && confirmed.user) {
            setUser(confirmed.user);
          }
          if (!cancelled && confirmed.subscription) {
            setSubscription(confirmed.subscription);
          }
        }
        if (!cancelled) {
          await Promise.all([fetchBalance(), fetchSubscription(), refetchUsage()]);
        }
      } catch {
        if (!cancelled) {
          await Promise.all([fetchBalance(), fetchSubscription(), refetchUsage()]);
        }
      } finally {
        if (!cancelled) {
          setPaymentSuccess(true);
          window.history.replaceState({}, "", "/dashboard/wallet");
        }
      }
    };

    void syncAfterCheckout();

    return () => {
      cancelled = true;
    };
  }, [searchParams, fetchBalance, fetchSubscription, refetchUsage, setUser]);

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
    const planName = selectedPlan.name;
    try {
      const data = await subscriptionService.createSubscription(selectedPlan.slug);
      setPaymentModalOpen(false);
      setSelectedPlan(null);
      if (data.razorpayKeyId && data.subscriptionId) {
        await openRazorpaySubscriptionCheckout({
          key: data.razorpayKeyId,
          subscriptionId: data.subscriptionId,
          name: "DataCaptain",
          description: planName,
          callbackUrl: `${window.location.origin}/api/payment/razorpay-callback`,
        });
      } else {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setCheckoutError(subscriptionService.getErrorMessage(err));
      setPaymentModalOpen(true);
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
    } finally {
      setCancelling(false);
    }
  };

  const pricingPlans = plans.map(mapPlanToPricing);
  const isActiveSub = subscription?.status === "ACTIVE";

  if (isLoading && credits === 0 && plansLoading) {
    return (
      <div className="space-y-8">
        <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-medium uppercase tracking-widest text-violet-300/80">Billing</p>
        <h1 className="mt-0.5 text-2xl font-semibold sm:text-3xl">Plans & billing</h1>
        <p className="mt-1 text-sm text-white/50">Manage subscriptions, credits, and payment history</p>
      </motion.div>

      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
          >
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                ✓
              </span>
              <div>
                <p className="text-sm font-medium text-emerald-200">Payment successful</p>
                <p className="text-xs text-emerald-200/70">Your subscription is being activated. Refresh if balance doesn&apos;t update.</p>
              </div>
            </div>
            <button type="button" onClick={() => setPaymentSuccess(false)} className="text-white/40 hover:text-white">
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {(error || plansError) && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error || plansError}
        </div>
      )}

      {/* Balance + subscription */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-[#0c0c14] to-violet-500/10 p-6"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/40">API balance</p>
              <p className="mt-2 text-4xl font-bold tabular-nums">
                <AnimatedCounter value={credits} />
              </p>
              <p className="mt-1 text-sm text-white/45">Request credits available</p>
              <Link href="/dashboard/usage" className="mt-3 inline-flex text-sm text-indigo-400 hover:underline">
                View usage →
              </Link>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/20">
              <svg className="h-7 w-7 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6.75m-6.75 0l-1.5 4.5m1.5-4.5 3 4.5M9 12.75h6.75M9 12.75l-1.5 4.5m1.5-4.5 3 4.5" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-6"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">Current plan</p>
          {isActiveSub && subscription ? (
            <div className="mt-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xl font-semibold">{subscription.plan.name}</p>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                  Active
                </span>
              </div>
              <p className="mt-2 text-sm text-white/50">
                Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <button
                type="button"
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/15 disabled:opacity-50"
              >
                {cancelling ? "Cancelling…" : "Cancel subscription"}
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-lg font-medium text-white/80">Free tier</p>
              <p className="mt-1 text-sm text-white/45">Upgrade below for higher daily API limits.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/80 overflow-hidden">
        <div className="flex border-b border-white/10 bg-black/30">
          {(["plans", "history"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 px-4 py-3.5 text-sm font-medium transition-colors sm:flex-none sm:px-8 ${
                activeTab === tab ? "text-white" : "text-white/45 hover:text-white/70"
              }`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="billing-tab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {tab === "plans" ? "Plans" : "Transaction history"}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "plans" && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm text-white/50">
                  Secure checkout via Razorpay. Enterprise plans — contact sales.
                </p>
                {plansLoading && pricingPlans.length === 0 ? (
                  <div className="flex justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-400" />
                  </div>
                ) : (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {pricingPlans.map((plan, i) => (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <PricingCard
                          plan={plan}
                          popular={plan.slug === "pro"}
                          isCurrent={
                            isActiveSub &&
                            subscription?.plan?.slug === plan.slug
                          }
                          onSelect={handleSelectPlan}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                {historyLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-400" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-white/40">No transactions yet</p>
                    <p className="mt-1 text-sm text-white/30">API usage and subscriptions appear here</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {history.map((entry, i) => {
                      const positive = entry.amount >= 0;
                      const iconPath = TX_ICONS[entry.type] || TX_ICONS.default;
                      return (
                        <motion.li
                          key={entry.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(i * 0.03, 0.3) }}
                          className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 hover:border-white/10"
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              positive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-white/90">{formatType(entry.type)}</p>
                            <p className="text-xs text-white/40">
                              {new Date(entry.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`font-semibold tabular-nums ${positive ? "text-emerald-400" : "text-red-400"}`}>
                              {positive ? "+" : ""}
                              {entry.amount}
                            </p>
                            <p className="text-xs text-white/35">bal {entry.balanceAfter}</p>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="text-center text-xs text-white/30">
        Payments processed securely by Razorpay · Questions?{" "}
        <Link href="/dashboard/support" className="text-indigo-400/80 hover:underline">
          Contact support
        </Link>
      </p>

      <Modal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setSelectedPlan(null);
          setCheckoutError(null);
        }}
        title="Complete payment"
      >
        <div className="space-y-5">
          {selectedPlan && (
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
              <p className="text-sm font-medium text-white">{selectedPlan.name}</p>
              <p className="mt-1 text-xs text-white/50">
                {selectedPlan.credits.toLocaleString()} requests/day ·{" "}
                {selectedPlan.price === -1
                  ? "Custom"
                  : selectedPlan.price === 0
                    ? "Free"
                    : `${formatMonthlyPrice(selectedPlan.price, selectedPlan.currency)}/mo`}
              </p>
            </div>
          )}
          <p className="text-sm text-white/55">
            You&apos;ll complete checkout on Razorpay. We never store your card details.
          </p>
          {checkoutError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {checkoutError}
            </div>
          )}
          <button
            type="button"
            onClick={handleRazorpayCheckout}
            disabled={checkoutLoading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50"
          >
            {checkoutLoading ? "Redirecting to Razorpay…" : "Proceed to payment"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
