/**
 * Admin marketing email API service
 */

import { api, getErrorMessage } from "@/lib/api";

type ApiResponse<T> = { success: boolean; data: T };

export type MarketingAudience = "free" | "lapsed" | "all";

export type MarketingContent = {
  subject: string;
  preheader: string;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  showPlans: boolean;
};

export type AudienceCounts = Record<MarketingAudience, number> & {
  optedOut: number;
  emailConfigured: boolean;
};

export type EmailPreview = { subject: string; html: string; text: string };

export type EmailCampaign = {
  id: string;
  subject: string;
  audience: MarketingAudience;
  status: "SENDING" | "COMPLETED" | "FAILED";
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  lastError: string | null;
  createdAt: string;
  completedAt: string | null;
};

export async function getAudienceCounts(): Promise<AudienceCounts> {
  const res = await api.get<ApiResponse<AudienceCounts>>("/admin/marketing/audience");
  if (!res.data.success) throw new Error("Failed to fetch audience");
  return res.data.data;
}

export async function previewEmail(content: MarketingContent): Promise<EmailPreview> {
  const res = await api.post<ApiResponse<EmailPreview>>("/admin/marketing/preview", content);
  if (!res.data.success) throw new Error("Failed to render preview");
  return res.data.data;
}

export async function sendTestEmail(content: MarketingContent, to?: string): Promise<{ to: string }> {
  const res = await api.post<ApiResponse<{ to: string }>>("/admin/marketing/test", { content, to });
  if (!res.data.success) throw new Error("Failed to send test email");
  return res.data.data;
}

export async function startCampaign(
  content: MarketingContent,
  audience: MarketingAudience,
  confirmCount: number
): Promise<EmailCampaign> {
  const res = await api.post<ApiResponse<EmailCampaign>>("/admin/marketing/campaigns", {
    content,
    audience,
    confirmCount,
  });
  if (!res.data.success) throw new Error("Failed to start campaign");
  return res.data.data;
}

export async function getCampaigns(): Promise<EmailCampaign[]> {
  const res = await api.get<ApiResponse<EmailCampaign[]>>("/admin/marketing/campaigns");
  if (!res.data.success) throw new Error("Failed to fetch campaigns");
  return res.data.data;
}

export { getErrorMessage };
