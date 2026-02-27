"use client";

import { useState, useEffect } from "react";
import * as adminService from "@/services/admin.service";
import Loader from "@/components/Loader";

export default function AdminInvestorPage() {
  const [metrics, setMetrics] = useState<adminService.InvestorMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getInvestorMetrics()
      .then(setMetrics)
      .catch(() => setMetrics(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (!metrics) {
    return <p className="text-red-400">Failed to load metrics</p>;
  }

  const kpis = [
    { label: "MRR", value: `₹${metrics.mrr.toFixed(0)}`, color: "text-green-400" },
    { label: "ARR", value: `₹${metrics.arr.toFixed(0)}`, color: "text-green-400" },
    { label: "ARPU", value: `₹${metrics.arpu.toFixed(2)}`, color: "text-white" },
    { label: "Churn %", value: `${metrics.churnRate}%`, color: "text-amber-400" },
    { label: "Growth %", value: `${metrics.growthRate}%`, color: metrics.growthRate >= 0 ? "text-green-400" : "text-red-400" },
    { label: "LTV", value: `₹${metrics.ltv.toFixed(0)}`, color: "text-white" },
    { label: "Profit Margin", value: `${metrics.profitMargin}%`, color: "text-green-400" },
    { label: "Burn Rate", value: `₹${metrics.burnRate.toFixed(0)}/mo`, color: "text-amber-400" },
    { label: "Runway", value: `${metrics.runwayMonths} months`, color: "text-white" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Investor Metrics</h1>
      <p className="mt-1 text-white/60">VC-grade KPIs for pitch decks and reporting</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">{k.label}</p>
            <p className={`mt-1 text-2xl font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium">Revenue Overview</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60">Total Revenue</span>
              <span>₹{metrics.totalRevenue.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">This Month</span>
              <span>₹{metrics.revenueThisMonth.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">API Cost (Month)</span>
              <span className="text-amber-400">${metrics.apiCostThisMonth.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium">User Base</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60">Total Users</span>
              <span>{metrics.totalUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Active Subscriptions</span>
              <span>{metrics.activeSubscriptions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
