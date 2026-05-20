import { queryNamespaces } from '@/shared/query';

export const notificationKeys = {
  all: [queryNamespaces.notification] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};
