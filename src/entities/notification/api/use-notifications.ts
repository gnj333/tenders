'use client';

import { useQuery } from '@tanstack/react-query';

import { http } from '@/shared/api';

import { type NotificationListResponse, NotificationListResponseSchema } from '../model/notification.schema';

import { notificationKeys } from './notification.keys';

async function fetchNotifications(): Promise<NotificationListResponse> {
  const json = await http<unknown>('/notifications');

  return NotificationListResponseSchema.parse(json);
}

/**
 * Polls the notifications endpoint every 30 seconds while the tab is focused.
 * Background tabs do not poll to save the user's battery and our API quota.
 */
export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    staleTime: 0,
  });
}
