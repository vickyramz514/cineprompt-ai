"use client";

import { useState, useEffect } from "react";
import * as adminService from "@/services/admin.service";
import Loader from "@/components/Loader";

export default function AdminAffiliatePage() {
  const [affiliates, setAffiliates] = useState<adminService.AdminAffiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAffiliates = () => {
    setLoading(true);
    adminService
      .getAffiliates()
      .then(setAffiliates)
      .catch((err) => setError(adminService.getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const handleApprovePayout = async (id: string) => {
    try {
      await adminService.approveAffiliatePayout(id);
      fetchAffiliates();
    } catch (err) {
      setError(adminService.getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Affiliates</h1>
      <p className="mt-1 text-white/60">Track and manage affiliate payouts</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Code</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Commission</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Total Earned</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Balance</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((a) => (
                <tr key={a.id} className="border-b border-white/5">
                  <td className="px-4 py-3">
                    <p className="font-medium">{a.user?.name}</p>
                    <p className="text-sm text-white/60">{a.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono">{a.referralCode}</td>
                  <td className="px-4 py-3">{(a.commissionRate * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3">₹{a.totalEarnings.toFixed(0)}</td>
                  <td className="px-4 py-3">₹{a.payoutBalance.toFixed(0)}</td>
                  <td className="px-4 py-3">
                    {a.payouts?.map((p) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <span>₹{p.amount.toFixed(0)} pending</span>
                        <button
                          onClick={() => handleApprovePayout(p.id)}
                          className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400 hover:bg-green-500/30"
                        >
                          Approve
                        </button>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
