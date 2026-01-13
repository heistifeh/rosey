"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBuilder } from "@/api/builder";
import { getUserId } from "@/api/axios-config";

export type NotificationRecord = {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
};

export function useNotifications() {
  const userId = getUserId();
  const query = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => apiBuilder.notifications.list(20),
    enabled: Boolean(userId),
  });

  const notifications: NotificationRecord[] = query.data ?? [];
  console.log("[notifications] data", notifications, "loading", query.isLoading);
  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useMarkNotificationRead() {
  const userId = getUserId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiBuilder.notifications.markRead(id),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      }
    },
  });
}
