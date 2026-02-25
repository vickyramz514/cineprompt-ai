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

export { getErrorMessage };
