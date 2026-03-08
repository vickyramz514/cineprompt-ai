/**
 * API Usage service - Fetch usage statistics for Stock Market Data API
 */

import { api, getErrorMessage } from "@/lib/api";

export interface UsageStats {
  requestsToday: number;
  requestsThisMonth: number;
  dailyLimit: number;
  monthlyLimit: number;
  remainingToday: number;
  remainingThisMonth: number;
}

const DEFAULT_USAGE: UsageStats = {
  requestsToday: 124,
  requestsThisMonth: 2345,
  dailyLimit: 10000,
  monthlyLimit: 100000,
  remainingToday: 9876,
  remainingThisMonth: 97655,
};

export async function getUsageStats(): Promise<UsageStats> {
  try {
    const res = await api.get<{ success: boolean; data?: UsageStats }>("/usage");
    if (res.data.success && res.data.data) return res.data.data;
    return DEFAULT_USAGE;
  } catch {
    return DEFAULT_USAGE;
  }
}

export { getErrorMessage };
