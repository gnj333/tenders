import { queryNamespaces } from '@/shared/query';

import type { TenderListParams } from '../model/tender.schema';

export const tenderKeys = {
  all: [queryNamespaces.tender] as const,
  lists: () => [...tenderKeys.all, 'list'] as const,
  list: (params: TenderListParams) => [...tenderKeys.lists(), params] as const,
  details: () => [...tenderKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenderKeys.details(), id] as const,
};
