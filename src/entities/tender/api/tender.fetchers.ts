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

import 'server-only';

const TENDERS_TAG = 'tenders';

/**
 * Server-side fetcher for tender lists. Cached with the `tenders` tag —
 * invalidate via `revalidateTag('tenders')` after mutations.
 */
export async function getTenders(params: TenderListParams = {}): Promise<TenderListResponse> {
  const parsed = TenderListParamsSchema.parse(params);
  const json = await http<unknown>('/tenders', {
    searchParams: parsed,
    next: { revalidate: 60, tags: [TENDERS_TAG] },
  });

  return TenderListResponseSchema.parse(json);
}

/**
 * Server-side fetcher for a single tender by id or slug.
 */
export async function getTenderById(id: string): Promise<Tender> {
  const json = await http<unknown>(`/tenders/${encodeURIComponent(id)}`, {
    next: { revalidate: 60, tags: [TENDERS_TAG, `tender:${id}`] },
  });

  return TenderSchema.parse(json);
}

/**
 * Returns all tender slugs. Used by `sitemap.ts` to enumerate detail pages.
 */
export async function getAllTenderSlugs(): Promise<ReadonlyArray<{ id: string; slug: string; updatedAt: string }>> {
  const { items } = await getTenders({ pageSize: 100 });

  return items.map((t) => ({ id: t.id, slug: t.slug, updatedAt: t.publishedAt }));
}

/**
 * Server-side mutation to create a tender. Returns the created entity.
 * Note: a real implementation must also call `revalidateTag(TENDERS_TAG)` in
 * the route handler / server action that wraps it.
 */
export async function createTender(input: TenderCreateInput): Promise<Tender> {
  const parsed = TenderCreateInputSchema.parse(input);
  const json = await http<unknown>('/tenders', { method: 'POST', body: parsed });

  return TenderSchema.parse(json);
}
