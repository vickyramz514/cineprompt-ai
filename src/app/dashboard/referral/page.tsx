"use client";

import { useState, useEffect } from "react";
import * as referralService from "@/services/referral.service";
import Loader from "@/components/Loader";

export default function ReferralPage() {
  const [stats, setStats] = useState<referralService.ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    referralService
      .getReferralStats()
      .then(setStats)
      .catch((err) => setError(referralService.getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const inviteUrl = typeof window !== "undefined" && stats
    ? `${window.location.origin}/auth/signup?ref=${stats.referralCode}`
    : "";

  const copyLink = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Referrals</h1>
      <p className="mt-1 text-white/60">Invite friends and earn credits</p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
          {error}
        </div>
      )}

      {stats && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/60">Your Code</p>
              <p className="mt-1 text-2xl font-mono font-bold">{stats.referralCode}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/60">Total Referrals</p>
              <p className="mt-1 text-2xl font-bold">{stats.totalReferrals}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/60">Credits Earned</p>
              <p className="mt-1 text-2xl font-bold text-green-400">{stats.creditsEarned}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-white/60">Cash Earned</p>
              <p className="mt-1 text-2xl font-bold">₹{stats.cashEarned.toFixed(0)}</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium">Invite Link</h2>
            <p className="mt-1 text-sm text-white/60">
              Share this link. When someone signs up, you both get bonus credits!
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-white"
              />
              <button
                onClick={copyLink}
                className="rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-600"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium">Referral History</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-4 py-3 text-left text-sm font-medium text-white/60">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Credits</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-white/60">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.referrals.map((r) => (
                    <tr key={r.id} className="border-b border-white/5">
                      <td className="px-4 py-3">
                        {r.referee ? `${r.referee.name} (${r.referee.email})` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-xs ${
                            r.status === "COMPLETED" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{r.rewardCredits}</td>
                      <td className="px-4 py-3 text-sm text-white/60">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
