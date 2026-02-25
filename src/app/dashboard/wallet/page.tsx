"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useCreditsStore } from "@/store/useStore";
import { PRICING_PLANS } from "@/lib/mock-data";
import PricingCard from "@/components/PricingCard";
import Modal from "@/components/Modal";
import Loader from "@/components/Loader";

export default function WalletPage() {
  const { credits, fetchBalance, addCredits } = useWallet();
  const { isLoading, error } = useCreditsStore();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [addingCredits, setAddingCredits] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleSelectPlan = (planId: string) => {
    if (planId === "free") return;
    setSelectedPlan(planId);
    setPaymentModalOpen(true);
  };

  const handleAddCredits = async () => {
    if (!selectedPlan) return;
    const plan = PRICING_PLANS.find((p) => p.id === selectedPlan);
    if (!plan || plan.credits <= 0) return;

    setAddingCredits(true);
    try {
      await addCredits(plan.credits, `mock-${Date.now()}`);
      setPaymentModalOpen(false);
      setSelectedPlan(null);
    } catch {
      // Error shown in store
    } finally {
      setAddingCredits(false);
    }
  };

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

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
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
      </div>

      <h2 className="mt-12 text-xl font-semibold">Add Credits</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING_PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            popular={plan.id === "creator"}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>

      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Complete payment"
      >
        <div className="space-y-4">
          <p className="text-sm text-white/60">
            Selected plan: {PRICING_PLANS.find((p) => p.id === selectedPlan)?.name}
          </p>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Payment method</p>
            <div className="mt-2 flex gap-2">
              <div className="flex-1 rounded-lg border border-indigo-500/50 bg-indigo-500/10 px-4 py-2 text-sm">
                Card
              </div>
              <div className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60">
                UPI
              </div>
            </div>
          </div>
          <button
            onClick={handleAddCredits}
            disabled={addingCredits}
            className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {addingCredits ? "Processing..." : "Add Credits (Mock)"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
