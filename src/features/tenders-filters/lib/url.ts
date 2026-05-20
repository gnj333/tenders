import type { TenderListParams, TenderStatus } from '@/entities/tender';

/**
 * Parses raw URL search params into a typed `TenderListParams` object. Unknown
 * status values are dropped silently — never trust the URL.
 */
export function searchParamsToFilters(raw: Record<string, string | string[] | undefined>): TenderListParams {
  const q = typeof raw.q === 'string' ? raw.q : undefined;
  const statusRaw = typeof raw.status === 'string' ? raw.status : undefined;
  const status: TenderStatus | undefined =
    statusRaw === 'open' || statusRaw === 'closed' || statusRaw === 'awarded' || statusRaw === 'draft' ? statusRaw : undefined;
  const category = typeof raw.category === 'string' ? raw.category : undefined;

  return {
    ...(q ? { q } : {}),
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
  };
}

/**
 * Serializes filters back into a URL search string. Empty/undefined fields
 * are omitted so the URL stays clean.
 */
export function filtersToSearchString(filters: TenderListParams): string {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.status) params.set('status', filters.status);
  if (filters.category) params.set('category', filters.category);

  return params.toString();
}
