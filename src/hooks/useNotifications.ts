"use client";

import { useCallback, useEffect, useState } from "react";
import * as notificationService from "@/services/notification.service";
import type { Notification } from "@/services/notification.service";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (unreadOnly?: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications({
        limit: 20,
        unread: unreadOnly,
      });
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      setError(notificationService.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    try {
      await notificationService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      setError(notificationService.getErrorMessage(err));
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await notificationService.markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(notificationService.getErrorMessage(err));
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markRead,
    markAllRead,
  };
}
