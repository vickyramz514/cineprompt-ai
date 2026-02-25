/**
 * Subscription API service
 */

import { api, getErrorMessage } from "@/lib/api";

export type SubscriptionPlan = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  priceCents: number;
  currency: string;
  credits: number;
  creditsPerMonth?: number | null;
  billingCycle?: string | null;
  features?: unknown;
};

export type UserSubscription = {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  plan: SubscriptionPlan;
};

export type PlansResponse = {
  plans: SubscriptionPlan[];
};

export type MySubscriptionResponse = {
  subscription: UserSubscription | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getPlans(): Promise<SubscriptionPlan[]> {
  const res = await api.get<ApiResponse<PlansResponse>>("/subscriptions/plans");
  if (!res.data.success) throw new Error("Failed to fetch plans");
  return res.data.data.plans;
}

export async function getMySubscription(): Promise<UserSubscription | null> {
  const res = await api.get<ApiResponse<MySubscriptionResponse>>("/subscriptions/me");
  if (!res.data.success) throw new Error("Failed to fetch subscription");
  return res.data.data.subscription;
}

export { getErrorMessage };
