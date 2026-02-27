/**
 * Admin API service
 */

import { api, getErrorMessage } from "@/lib/api";

export type ApiResponse<T> = { success: boolean; data: T };

export type DashboardData = {
  totalUsers: number;
  totalJobs: number;
  todayJobs: number;
  totalRevenue: number;
  totalApiCost: number;
  totalProfit: number;
  activeSubscriptions: number;
};

export type ChartData = {
  dailyJobs: { date: string; jobs: number }[];
  dailyRevenue: { date: string; cents: number }[];
  dailyCost: { date: string; cost_usd: number }[];
  days: number;
};

export type PaginatedResponse<T> = {
  [key: string]: T[] | number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getDashboard(): Promise<DashboardData> {
  const res = await api.get<ApiResponse<DashboardData>>("/admin/dashboard");
  if (!res.data.success) throw new Error("Failed to fetch dashboard");
  return res.data.data;
}

export async function getDashboardCharts(days = 30): Promise<ChartData> {
  const res = await api.get<ApiResponse<ChartData>>("/admin/dashboard/charts", {
    params: { days },
  });
  if (!res.data.success) throw new Error("Failed to fetch charts");
  return res.data.data;
}

export async function getUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<AdminUser[]>> {
  const res = await api.get<ApiResponse<PaginatedResponse<AdminUser[]>>>(
    "/admin/users",
    { params }
  );
  if (!res.data.success) throw new Error("Failed to fetch users");
  return res.data.data;
}

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export async function getUserById(id: string) {
  const res = await api.get<ApiResponse<AdminUser & { wallet?: unknown }>>(
    `/admin/users/${id}`
  );
  if (!res.data.success) throw new Error("Failed to fetch user");
  return res.data.data;
}

export async function updateUserCredit(
  userId: string,
  amount: number
): Promise<{ credits: number; delta: number }> {
  const res = await api.post<ApiResponse<{ credits: number; delta: number }>>(
    `/admin/users/${userId}/credit`,
    { amount }
  );
  if (!res.data.success) throw new Error("Failed to update credits");
  return res.data.data;
}

export async function blockUser(userId: string): Promise<void> {
  const res = await api.post<ApiResponse<{ message: string }>>(
    `/admin/users/${userId}/block`
  );
  if (!res.data.success) throw new Error("Failed to block user");
}

export async function unblockUser(userId: string): Promise<void> {
  const res = await api.post<ApiResponse<{ message: string }>>(
    `/admin/users/${userId}/unblock`
  );
  if (!res.data.success) throw new Error("Failed to unblock user");
}

export async function planOverride(
  userId: string,
  plan: string
): Promise<{ plan: string }> {
  const res = await api.post<ApiResponse<{ plan: string }>>(
    `/admin/users/${userId}/plan-override`,
    { plan }
  );
  if (!res.data.success) throw new Error("Failed to update plan");
  return res.data.data;
}

export async function getJobs(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedResponse<AdminJob[]>> {
  const res = await api.get<ApiResponse<PaginatedResponse<AdminJob[]>>>(
    "/admin/jobs",
    { params }
  );
  if (!res.data.success) throw new Error("Failed to fetch jobs");
  return res.data.data;
}

export type AdminJob = {
  id: string;
  userId: string;
  prompt: string;
  status: string;
  provider: string;
  creditsUsed: number;
  cost: number | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
};

export async function getJobById(id: string) {
  const res = await api.get<ApiResponse<AdminJob>>(`/admin/jobs/${id}`);
  if (!res.data.success) throw new Error("Failed to fetch job");
  return res.data.data;
}

export async function cancelJob(jobId: string): Promise<void> {
  const res = await api.post<ApiResponse<{ message: string }>>(
    `/admin/jobs/${jobId}/cancel`
  );
  if (!res.data.success) throw new Error("Failed to cancel job");
}

export async function getPayments(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<AdminPayment[]>> {
  const res = await api.get<ApiResponse<PaginatedResponse<AdminPayment[]>>>(
    "/admin/payments",
    { params }
  );
  if (!res.data.success) throw new Error("Failed to fetch payments");
  return res.data.data;
}

export type AdminPayment = {
  id: string;
  userId: string;
  amountCents: number;
  status: string;
  provider: string;
  providerId: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
};

export async function getSubscriptions(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<AdminSubscription[]>> {
  const res = await api.get<ApiResponse<PaginatedResponse<AdminSubscription[]>>>(
    "/admin/subscriptions",
    { params }
  );
  if (!res.data.success) throw new Error("Failed to fetch subscriptions");
  return res.data.data;
}

export type AdminSubscription = {
  id: string;
  userId: string;
  status: string;
  currentPeriodEnd: string;
  user: { id: string; name: string; email: string };
  plan: { name: string; slug: string; priceCents: number };
};

export async function getAbuseLogs(params?: {
  page?: number;
  limit?: number;
  type?: string;
}): Promise<PaginatedResponse<AdminAbuseLog[]>> {
  const res = await api.get<ApiResponse<PaginatedResponse<AdminAbuseLog[]>>>(
    "/admin/abuse-logs",
    { params }
  );
  if (!res.data.success) throw new Error("Failed to fetch abuse logs");
  return res.data.data;
}

export type AdminAbuseLog = {
  id: string;
  userId: string;
  type: string;
  meta: unknown;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
};

export { getErrorMessage };
