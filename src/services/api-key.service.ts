/**
 * API Key service - Fetch and manage API keys for Stock Market Data API
 */

import { api, getErrorMessage } from "@/lib/api";

export interface ApiKeyInfo {
  key: string;
  prefix: string;
  createdAt: string;
}

export async function getApiKey(): Promise<ApiKeyInfo> {
  const res = await api.get<{ success: boolean; data?: ApiKeyInfo }>("/api-keys/me");
  if (!res.data.success || !res.data.data) {
    throw new Error("Failed to load API key");
  }
  return res.data.data;
}

export async function regenerateApiKey(): Promise<ApiKeyInfo> {
  try {
    const res = await api.post<{ success: boolean; data?: ApiKeyInfo }>("/api-keys/regenerate");
    if (res.data.success && res.data.data) return res.data.data;
    return getApiKey();
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export { getErrorMessage };
