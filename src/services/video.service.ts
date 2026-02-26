/**
 * Video API service
 */

import { api, getErrorMessage } from "@/lib/api";

export type VideoJobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type VideoJob = {
  id: string;
  prompt: string;
  status: VideoJobStatus;
  progress?: number;
  creditsUsed?: number;
  videoUrl?: string | null;
  createdAt: string;
  completedAt?: string | null;
};

export type GenerateVideoPayload = {
  prompt: string;
  duration?: number;
  durationSeconds?: number;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  style?: "cinematic" | "anime" | "realistic" | "fantasy";
};

export type GenerateVideoResponse = {
  job: {
    id: string;
    status: string;
    progress?: number;
    creditsUsed: number;
    createdAt: string;
  };
};

export type HistoryResponse = {
  jobs: VideoJob[];
  total: number;
  limit: number;
  offset: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function generateVideo(payload: GenerateVideoPayload): Promise<GenerateVideoResponse> {
  const res = await api.post<ApiResponse<GenerateVideoResponse>>("/video/generate", payload);
  if (!res.data.success) throw new Error("Generate failed");
  return res.data.data;
}

export async function getVideoHistory(limit = 20, offset = 0): Promise<HistoryResponse> {
  const res = await api.get<ApiResponse<HistoryResponse>>("/video/history", {
    params: { limit, offset },
  });
  if (!res.data.success) throw new Error("Failed to fetch history");
  return res.data.data;
}

export async function getVideoById(id: string): Promise<{ job: VideoJob }> {
  const res = await api.get<ApiResponse<{ job: VideoJob }>>(`/video/${id}`);
  if (!res.data.success) throw new Error("Failed to fetch video");
  return res.data.data;
}

export { getErrorMessage };
