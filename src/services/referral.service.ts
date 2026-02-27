import { api, getErrorMessage } from "@/lib/api";

export type ReferralStats = {
  referralCode: string;
  totalReferrals: number;
  completedReferrals: number;
  creditsEarned: number;
  cashEarned: number;
  referrals: { id: string; status: string; rewardCredits: number; createdAt: string; referee?: { name: string; email: string } }[];
};

export type AffiliateDashboard = {
  referralCode: string;
  commissionRate: number;
  totalEarnings: number;
  payoutBalance: number;
  referrals: unknown[];
  payouts: { id: string; amount: number; status: string; createdAt: string }[];
};

export async function applyReferral(code: string) {
  const res = await api.post<{ success: boolean; data: unknown }>(
    "/referral/apply",
    { code }
  );
  if (!res.data.success) throw new Error("Failed to apply referral");
  return res.data.data;
}

export async function getReferralStats(): Promise<ReferralStats> {
  const res = await api.get<{ success: boolean; data: ReferralStats }>(
    "/referral/stats"
  );
  if (!res.data.success) throw new Error("Failed to fetch stats");
  return res.data.data;
}

export async function getAffiliateDashboard(): Promise<AffiliateDashboard> {
  const res = await api.get<{ success: boolean; data: AffiliateDashboard }>(
    "/affiliate/dashboard"
  );
  if (!res.data.success) throw new Error("Failed to fetch dashboard");
  return res.data.data;
}

export async function requestPayout(amount: number) {
  const res = await api.post<{ success: boolean; data: unknown }>(
    "/affiliate/payout-request",
    { amount }
  );
  if (!res.data.success) throw new Error("Failed to request payout");
  return res.data.data;
}

export { getErrorMessage };
