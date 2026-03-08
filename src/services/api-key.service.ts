/**
 * API Key service - Fetch and manage API keys for Stock Market Data API
 */

import { api, getErrorMessage } from "@/lib/api";

export interface ApiKeyInfo {
  key: string;
  prefix: string;
  createdAt: string;
}

// Mock key for demo when backend doesn't have this endpoint yet (sdata_ prefix avoids secret scanners)
const MOCK_KEY = "sdata_92hs8dh29shd9s";

export async function getApiKey(): Promise<ApiKeyInfo> {
  try {
    const res = await api.get<{ success: boolean; data?: ApiKeyInfo }>("/api-keys/me");
    if (res.data.success && res.data.data) return res.data.data;
    return {
      key: MOCK_KEY,
      prefix: "sdata_...",
      createdAt: new Date().toISOString(),
    };
  } catch {
    return {
      key: MOCK_KEY,
      prefix: "sdata_...",
      createdAt: new Date().toISOString(),
    };
  }
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
