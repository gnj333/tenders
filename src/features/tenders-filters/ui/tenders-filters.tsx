'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Search } from 'lucide-react';

import { useDebounce } from '@/shared/hooks';

import type { TenderListParams, TenderStatus } from '@/entities/tender';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { filtersToSearchString } from '../lib/url';

const STATUS_OPTIONS: ReadonlyArray<{ value: TenderStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Все статусы' },
  { value: 'open', label: 'Открыт' },
  { value: 'closed', label: 'Закрыт' },
  { value: 'awarded', label: 'Завершён' },
  { value: 'draft', label: 'Черновик' },
];

type Props = {
  initialFilters: TenderListParams;
  /** Called with the latest debounced filters so the parent can refetch. */
  onChange: (filters: TenderListParams) => void;
};

/**
 * Controlled filter panel for the tenders list. Syncs filters into the URL
 * via `router.replace` (no page reload, no scroll jump) and notifies the
 * parent for client-side refetching through TanStack Query.
 *
 * Search input is debounced so we don't fire a request on every keystroke.
 */
export function TendersFilters({ initialFilters, onChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = React.useState(initialFilters.q ?? '');
  const [status, setStatus] = React.useState<TenderStatus | 'all'>(initialFilters.status ?? 'all');

  const debouncedQuery = useDebounce(query, 300);

  // Compose the current filter object whenever debounced search or status changes.
  const filters: TenderListParams = React.useMemo(
    () => ({
      ...(debouncedQuery.trim() ? { q: debouncedQuery.trim() } : {}),
      ...(status !== 'all' ? { status } : {}),
    }),
    [debouncedQuery, status],
  );

  // Push filters up so the parent can refetch via useQuery.
  React.useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  // Mirror filters into the URL so refresh / share / back button keep state.
  React.useEffect(() => {
    const qs = filtersToSearchString(filters);
    router.replace(`${pathname}${qs ? `?${qs}` : ''}` as never, { scroll: false });
  }, [filters, pathname, router]);

  return (
    <div className='border-border bg-card flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-end'>
      <div className='flex-1'>
        <Label htmlFor='tender-search'>Поиск</Label>
        <div className='relative mt-1.5'>
          <Search
            aria-hidden
            className='text-text-secondary pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2'
          />
          <Input
            id='tender-search'
            placeholder='По названию или описанию'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='pl-8'
          />
        </div>
      </div>

      <div className='sm:w-56'>
        <Label htmlFor='tender-status'>Статус</Label>
        <div className='mt-1.5'>
          <Select value={status} onValueChange={(v) => setStatus(v as TenderStatus | 'all')}>
            <SelectTrigger id='tender-status'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
