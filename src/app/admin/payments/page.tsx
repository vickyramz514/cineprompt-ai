"use client";

import { useState, useEffect } from "react";
import * as adminService from "@/services/admin.service";
import Loader from "@/components/Loader";

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState<"payments" | "subscriptions">("payments");
  const [payments, setPayments] = useState<adminService.AdminPayment[]>([]);
  const [subscriptions, setSubscriptions] = useState<
    adminService.AdminSubscription[]
  >([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 20;

  useEffect(() => {
    setLoading(true);
    if (tab === "payments") {
      adminService
        .getPayments({ page, limit })
        .then((data) => {
          setPayments(data.payments as adminService.AdminPayment[]);
          setTotal(data.total);
        })
        .catch((err) => setError(adminService.getErrorMessage(err)))
        .finally(() => setLoading(false));
    } else {
      adminService
        .getSubscriptions({ page, limit })
        .then((data) => {
          setSubscriptions(data.subscriptions as adminService.AdminSubscription[]);
          setTotal(data.total);
        })
        .catch((err) => setError(adminService.getErrorMessage(err)))
        .finally(() => setLoading(false));
    }
  }, [tab, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Payments</h1>
      <p className="mt-1 text-white/60">Payment and subscription monitoring</p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => {
            setTab("payments");
            setPage(1);
          }}
          className={`rounded-lg px-4 py-2 ${
            tab === "payments" ? "bg-indigo-500" : "bg-white/5"
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => {
            setTab("subscriptions");
            setPage(1);
          }}
          className={`rounded-lg px-4 py-2 ${
            tab === "subscriptions" ? "bg-indigo-500" : "bg-white/5"
          }`}
        >
          Subscriptions
        </button>
      </div>

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : tab === "payments" ? (
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Gateway ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="px-4 py-3">
                    {p.user?.name} ({p.user?.email})
                  </td>
                  <td className="px-4 py-3">₹{(p.amountCents / 100).toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        p.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{p.providerId || "-"}</td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Plan</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Ends</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-b border-white/5">
                  <td className="px-4 py-3">
                    {s.user?.name} ({s.user?.email})
                  </td>
                  <td className="px-4 py-3">{s.plan?.name}</td>
                  <td className="px-4 py-3">₹{((s.plan?.priceCents ?? 0) / 100).toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        s.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    {new Date(s.currentPeriodEnd).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded bg-white/5 px-4 py-2 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="flex items-center px-4">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded bg-white/5 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
