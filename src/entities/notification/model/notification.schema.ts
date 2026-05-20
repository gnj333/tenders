import { z } from 'zod';

export const NotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string().datetime(),
  read: z.boolean(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const NotificationListResponseSchema = z.object({
  items: NotificationSchema.array(),
  unread: z.number().int().nonnegative(),
});

export type NotificationListResponse = z.infer<typeof NotificationListResponseSchema>;
