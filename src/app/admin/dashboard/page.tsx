"use client";

import { useState, useEffect } from "react";
import * as adminService from "@/services/admin.service";
import Loader from "@/components/Loader";

export default function AdminDashboardPage() {
  const [data, setData] = useState<adminService.DashboardData | null>(null);
  const [charts, setCharts] = useState<adminService.ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      adminService.getDashboard(),
      adminService.getDashboardCharts(30),
    ])
      .then(([d, c]) => {
        setData(d);
        setCharts(c);
      })
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400">
        {error}
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: data?.totalUsers ?? 0 },
    { label: "Active Subscriptions", value: data?.activeSubscriptions ?? 0 },
    {
      label: "Monthly Revenue",
      value: `₹${((data?.totalRevenue ?? 0) / 100).toLocaleString()}`,
    },
    {
      label: "Monthly Cost",
      value: `$${(data?.totalApiCost ?? 0).toFixed(2)}`,
    },
    {
      label: "Profit",
      value: `₹${(data?.totalProfit ?? 0).toFixed(0)}`,
    },
    { label: "Today's Jobs", value: data?.todayJobs ?? 0 },
    { label: "Total Jobs", value: data?.totalJobs ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-white/60">Platform overview and metrics</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-6"
          >
            <p className="text-sm text-white/60">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {charts && (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="font-semibold">Daily Jobs</h3>
            <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
              {charts.dailyJobs?.slice(-14).map((d: { date: string; jobs: number }) => (
                <div key={d.date} className="flex justify-between text-sm">
                  <span className="text-white/60">{d.date}</span>
                  <span>{d.jobs}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="font-semibold">Daily Revenue (₹)</h3>
            <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
              {charts.dailyRevenue?.slice(-14).map((d: { date: string; cents: number }) => (
                <div key={d.date} className="flex justify-between text-sm">
                  <span className="text-white/60">{d.date}</span>
                  <span>{(d.cents / 100).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="font-semibold">Daily Cost ($)</h3>
            <div className="mt-4 max-h-48 space-y-2 overflow-y-auto">
              {charts.dailyCost?.slice(-14).map((d: { date: string; cost_usd: number }) => (
                <div key={d.date} className="flex justify-between text-sm">
                  <span className="text-white/60">{d.date}</span>
                  <span>{(d.cost_usd ?? 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
