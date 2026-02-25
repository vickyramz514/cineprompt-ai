"use client";

import { useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import Loader from "@/components/Loader";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markRead,
    markAllRead,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="mt-1 text-white/60">Your activity and updates</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="rounded-lg px-3 py-1.5 text-sm text-indigo-400 hover:bg-indigo-500/10"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-12 text-center text-white/50">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 transition-colors ${
                n.readAt
                  ? "border-white/5 bg-white/[0.02]"
                  : "border-indigo-500/20 bg-indigo-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white/90">{n.title}</p>
                  {n.body && (
                    <p className="mt-1 text-sm text-white/60">{n.body}</p>
                  )}
                  <p className="mt-2 text-xs text-white/40">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.readAt && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="shrink-0 rounded-lg px-2 py-1 text-xs text-indigo-400 hover:bg-indigo-500/10"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
