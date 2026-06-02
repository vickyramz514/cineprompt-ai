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
  plan?: string;
}

export async function getUsageStats(): Promise<UsageStats> {
  const res = await api.get<{ success: boolean; data?: UsageStats }>("/usage");
  if (!res.data.success || !res.data.data) {
    throw new Error("Failed to load usage statistics");
  }
  return res.data.data;
}

export { getErrorMessage };
