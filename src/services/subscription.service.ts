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

export type CreateSubscriptionResponse = {
  subscriptionId: string;
  checkoutUrl: string;
  planId: string;
  planSlug: string;
};

export async function createSubscription(planSlug: string): Promise<CreateSubscriptionResponse> {
  const res = await api.post<ApiResponse<CreateSubscriptionResponse>>("/subscriptions/create", {
    planSlug,
  });
  if (!res.data.success) throw new Error("Failed to create subscription");
  return res.data.data;
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const res = await api.post<ApiResponse<{ message: string }>>("/subscriptions/cancel", {
    subscriptionId,
  });
  if (!res.data.success) throw new Error("Failed to cancel subscription");
}

export type SubscriptionStatusResponse = {
  subscription: {
    id: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    externalId: string | null;
    plan: SubscriptionPlan;
  } | null;
};

export async function getSubscriptionStatus(): Promise<SubscriptionStatusResponse["subscription"]> {
  const res = await api.get<ApiResponse<SubscriptionStatusResponse>>("/subscriptions/status");
  if (!res.data.success) throw new Error("Failed to fetch subscription status");
  return res.data.data.subscription;
}

export { getErrorMessage };
