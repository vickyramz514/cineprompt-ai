"use client";

import { useState } from "react";
import { useCreditsStore } from "@/store/useStore";
import { PRICING_PLANS } from "@/lib/mock-data";
import PricingCard from "@/components/PricingCard";
import Modal from "@/components/Modal";

export default function WalletPage() {
  const credits = useCreditsStore((s) => s.credits);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    if (planId === "free") return;
    setSelectedPlan(planId);
    setPaymentModalOpen(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Wallet</h1>
      <p className="mt-1 text-white/60">Manage your credits and subscription</p>

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

      <h2 className="mt-12 text-xl font-semibold">Plans</h2>
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
            onClick={() => setPaymentModalOpen(false)}
            className="w-full rounded-xl bg-indigo-500 py-3 font-semibold text-white hover:bg-indigo-600"
          >
            Pay (Mock)
          </button>
        </div>
      </Modal>
    </div>
  );
}
