/**
 * Notification API service
 */

import { api, getErrorMessage } from "@/lib/api";

export type Notification = {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  data?: unknown;
  readAt?: string | null;
  createdAt: string;
};

export type NotificationsResponse = {
  notifications: Notification[];
  unreadCount: number;
  limit: number;
  offset: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function getNotifications(
  params?: { limit?: number; offset?: number; unread?: boolean }
): Promise<NotificationsResponse> {
  const res = await api.get<ApiResponse<NotificationsResponse>>("/notifications", {
    params: params || {},
  });
  if (!res.data.success) throw new Error("Failed to fetch notifications");
  return res.data.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  const res = await api.patch<ApiResponse<{ read: boolean }>>(`/notifications/${id}/read`);
  if (!res.data.success) throw new Error("Failed to mark as read");
}

export async function markAllNotificationsRead(): Promise<void> {
  const res = await api.patch<ApiResponse<{ read: boolean }>>("/notifications/read-all");
  if (!res.data.success) throw new Error("Failed to mark all as read");
}

export { getErrorMessage };
