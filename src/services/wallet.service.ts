/**
 * Wallet API service
 */

import { api, getErrorMessage } from "@/lib/api";

export type BalanceResponse = {
  credits: number;
  plan?: string;
};

export type AddCreditsPayload = {
  amount: number;
  paymentId?: string;
};

export type AddCreditsResponse = {
  credits: number;
  added: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getBalance(): Promise<BalanceResponse> {
  const res = await api.get<ApiResponse<BalanceResponse>>("/wallet/balance");
  if (!res.data.success) throw new Error("Failed to fetch balance");
  return res.data.data;
}

export async function addCredits(payload: AddCreditsPayload): Promise<AddCreditsResponse> {
  const res = await api.post<ApiResponse<AddCreditsResponse>>("/wallet/add", payload);
  if (!res.data.success) throw new Error("Failed to add credits");
  return res.data.data;
}

export type CreditLedgerEntry = {
  id: string;
  amount: number;
  balanceAfter: number;
  type: string;
  status: string;
  referenceId: string | null;
  referenceType: string | null;
  description: string | null;
  createdAt: string;
};

export type WalletHistoryResponse = {
  entries: CreditLedgerEntry[];
  total: number;
  limit: number;
  offset: number;
};

export async function getHistory(params?: {
  limit?: number;
  offset?: number;
}): Promise<WalletHistoryResponse> {
  const res = await api.get<ApiResponse<WalletHistoryResponse>>("/wallet/history", {
    params: params || {},
  });
  if (!res.data.success) throw new Error("Failed to fetch history");
  return res.data.data;
}

export { getErrorMessage };
