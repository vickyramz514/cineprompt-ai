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

export async function getSupportTickets(params?: {
  status?: string;
  priority?: string;
  limit?: number;
  offset?: number;
}) {
  const res = await api.get<ApiResponse<{ tickets: SupportTicket[]; total: number }>>(
    "/admin/support/tickets",
    { params }
  );
  if (!res.data.success) throw new Error("Failed to fetch tickets");
  return res.data.data;
}

export type SupportTicket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  messages?: { id: string; sender: string; message: string; createdAt: string }[];
};

export async function getSupportTicketById(id: string) {
  const res = await api.get<ApiResponse<SupportTicket>>(`/admin/support/tickets/${id}`);
  if (!res.data.success) throw new Error("Failed to fetch ticket");
  return res.data.data;
}

export async function addSupportMessage(ticketId: string, message: string) {
  const res = await api.post<ApiResponse<{ id: string }>>(
    `/admin/support/tickets/${ticketId}/message`,
    { message }
  );
  if (!res.data.success) throw new Error("Failed to send message");
  return res.data.data;
}

export async function closeSupportTicket(ticketId: string) {
  const res = await api.post<ApiResponse<SupportTicket>>(
    `/admin/support/tickets/${ticketId}/close`
  );
  if (!res.data.success) throw new Error("Failed to close ticket");
  return res.data.data;
}

export async function getGrowthOverview(days = 30) {
  const res = await api.get<ApiResponse<GrowthOverview>>("/admin/growth/overview", {
    params: { days },
  });
  if (!res.data.success) throw new Error("Failed to fetch growth");
  return res.data.data;
}

export type GrowthOverview = {
  dailySignups: { date: string; count: number }[];
  dailyActives: { date: string; count: number }[];
  totalUsers: number;
  totalPaidUsers: number;
  retention: unknown;
  churn: { cancelled: number; total: number; churnRate: number };
  funnel: {
    signups: number;
    firstVideo: number;
    subscriptions: number;
    signupToVideo: number;
    videoToSub: number;
  };
  days: number;
};

export async function getInvestorMetrics() {
  const res = await api.get<ApiResponse<InvestorMetrics>>("/admin/investor/metrics");
  if (!res.data.success) throw new Error("Failed to fetch metrics");
  return res.data.data;
}

export type InvestorMetrics = {
  mrr: number;
  arr: number;
  arpu: number;
  churnRate: number;
  growthRate: number;
  ltv: number;
  profitMargin: number;
  burnRate: number;
  runwayMonths: number;
  activeSubscriptions: number;
  totalUsers: number;
  totalRevenue: number;
  revenueThisMonth: number;
  apiCostThisMonth: number;
};

export async function getAffiliates() {
  const res = await api.get<ApiResponse<AdminAffiliate[]>>("/admin/affiliate");
  if (!res.data.success) throw new Error("Failed to fetch affiliates");
  return res.data.data;
}

export type AdminAffiliate = {
  id: string;
  userId: string;
  referralCode: string;
  commissionRate: number;
  totalEarnings: number;
  payoutBalance: number;
  user: { id: string; name: string; email: string };
  payouts?: { id: string; amount: number; status: string; createdAt: string }[];
};

export async function approveAffiliatePayout(payoutId: string) {
  const res = await api.post<ApiResponse<unknown>>(`/admin/affiliate/payout/${payoutId}`);
  if (!res.data.success) throw new Error("Failed to approve payout");
  return res.data.data;
}

export { getErrorMessage };
