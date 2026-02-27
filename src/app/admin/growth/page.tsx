"use client";

import { useState, useEffect } from "react";
import * as adminService from "@/services/admin.service";
import Loader from "@/components/Loader";

export default function AdminGrowthPage() {
  const [data, setData] = useState<adminService.GrowthOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    adminService
      .getGrowthOverview(days)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Growth Analytics</h1>
      <p className="mt-1 text-white/60">Funnel, retention, and growth metrics</p>

      <div className="mt-6">
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value, 10))}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {data && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/60">Total Users</p>
              <p className="mt-1 text-2xl font-bold">{data.totalUsers}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/60">Paid Users</p>
              <p className="mt-1 text-2xl font-bold">{data.totalPaidUsers}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/60">Churn Rate</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">{data.churn.churnRate.toFixed(1)}%</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/60">Cancelled (period)</p>
              <p className="mt-1 text-2xl font-bold">{data.churn.cancelled}</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium">Funnel Conversion</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-white/60">Signups</p>
                <p className="text-xl font-bold">{data.funnel.signups}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">First Video</p>
                <p className="text-xl font-bold">{data.funnel.firstVideo}</p>
                <p className="text-xs text-green-400">Signup → Video: {data.funnel.signupToVideo}%</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Subscriptions</p>
                <p className="text-xl font-bold">{data.funnel.subscriptions}</p>
                <p className="text-xs text-green-400">Video → Sub: {data.funnel.videoToSub}%</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium">Daily Signups</h2>
            <div className="mt-4 max-h-48 overflow-y-auto">
              {data.dailySignups?.length ? (
                <div className="space-y-2">
                  {(data.dailySignups as { date: string; count: number }[]).map((d) => (
                    <div key={d.date} className="flex justify-between text-sm">
                      <span>{d.date}</span>
                      <span className="font-medium">{d.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No data</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
