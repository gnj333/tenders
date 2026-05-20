'use client';

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { http } from '@/shared/api';

import {
  type Tender,
  type TenderCreateInput,
  TenderCreateInputSchema,
  type TenderListParams,
  TenderListParamsSchema,
  type TenderListResponse,
  TenderListResponseSchema,
  TenderSchema,
} from '../model/tender.schema';

import { tenderKeys } from './tender.keys';

/* ------------------------------------------------------------------ */
/*  Plain client-side fetch functions (no React, reused across hooks) */
/* ------------------------------------------------------------------ */

async function fetchTenders(params: TenderListParams): Promise<TenderListResponse> {
  const parsed = TenderListParamsSchema.parse(params);
  const json = await http<unknown>('/tenders', { searchParams: parsed });

  return TenderListResponseSchema.parse(json);
}

async function fetchTenderById(id: string): Promise<Tender> {
  const json = await http<unknown>(`/tenders/${encodeURIComponent(id)}`);

  return TenderSchema.parse(json);
}

async function postTender(input: TenderCreateInput): Promise<Tender> {
  const parsed = TenderCreateInputSchema.parse(input);
  const json = await http<unknown>('/tenders', { method: 'POST', body: parsed });

  return TenderSchema.parse(json);
}

async function deleteTender(id: string): Promise<void> {
  await http<unknown>(`/tenders/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/* ------------------------------------------------------------------ */
/*  Query hooks                                                       */
/* ------------------------------------------------------------------ */

export function useTendersQuery(params: TenderListParams = {}) {
  return useQuery({
    queryKey: tenderKeys.list(params),
    queryFn: () => fetchTenders(params),
  });
}

export function useTenderQuery(id: string) {
  return useQuery({
    queryKey: tenderKeys.detail(id),
    queryFn: () => fetchTenderById(id),
    enabled: id.length > 0,
  });
}

/**
 * Suspense variant. Throws to the nearest `<Suspense>` boundary while loading
 * and to the nearest `error.tsx` on failure.
 */
export function useTenderSuspenseQuery(id: string) {
  return useSuspenseQuery({
    queryKey: tenderKeys.detail(id),
    queryFn: () => fetchTenderById(id),
  });
}

/**
 * Infinite list. Uses page/pageSize from the server contract.
 */
export function useInfiniteTendersQuery(filters: Omit<TenderListParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: [...tenderKeys.lists(), 'infinite', filters] as const,
    queryFn: ({ pageParam }) => fetchTenders({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const loaded = last.page * last.pageSize;

      return loaded < last.total ? last.page + 1 : undefined;
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Mutation hooks                                                    */
/* ------------------------------------------------------------------ */

export function useCreateTenderMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: postTender,
    onSuccess: (created) => {
      // Lists are stale now — refetch any active list query.
      qc.invalidateQueries({ queryKey: tenderKeys.lists() });
      // Prime the detail cache so the redirect lands instantly.
      qc.setQueryData(tenderKeys.detail(created.id), created);
    },
  });
}

export function useDeleteTenderMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteTender,
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: tenderKeys.lists() });
      qc.removeQueries({ queryKey: tenderKeys.detail(id) });
    },
  });
}
