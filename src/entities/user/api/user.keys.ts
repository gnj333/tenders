import { queryNamespaces } from '@/shared/query';

export const userKeys = {
  all: [queryNamespaces.user] as const,
  me: () => [...userKeys.all, 'me'] as const,
};
