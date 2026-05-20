'use client';

import * as React from 'react';

import { TenderCard, type TenderListParams, useTendersQuery } from '@/entities/tender';
import { TenderPreviewButton, TenderQuickPreviewProvider } from '@/features/tender-quick-preview';

import { TendersFilters } from './tenders-filters';

type Props = {
  initialFilters: TenderListParams;
};

/**
 * Client orchestrator for the `/tenders` page.
 *
 *  1. Receives `initialFilters` parsed from the URL on the server.
 *  2. On first render `useTendersQuery(initialFilters)` resolves instantly
 *     from `HydrationBoundary` — no extra network call.
 *  3. When the user changes filters, a new query key triggers a client
 *     refetch via TanStack Query. The server is not involved.
 */
export function TendersList({ initialFilters }: Props) {
  const [filters, setFilters] = React.useState<TenderListParams>(initialFilters);
  const { data, isLoading, isFetching, error } = useTendersQuery(filters);

  return (
    <TenderQuickPreviewProvider>
      <div className='flex flex-col gap-6'>
        <TendersFilters initialFilters={initialFilters} onChange={setFilters} />

        {error ? (
          <p className='text-destructive'>Не удалось загрузить тендеры. Попробуйте ещё раз.</p>
        ) : isLoading ? (
          <TendersGridSkeleton />
        ) : !data || data.items.length === 0 ? (
          <p className='text-text-secondary'>По заданным фильтрам ничего не найдено.</p>
        ) : (
          <>
            <p className='text-text-secondary text-sm' aria-live='polite'>
              Найдено: {data.total} {pluralizeTenders(data.total)}
              {isFetching ? ' · обновляется…' : ''}
            </p>
            <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {data.items.map((tender) => (
                <li key={tender.id}>
                  <TenderCard tender={tender} actionSlot={<TenderPreviewButton tenderId={tender.id} />} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </TenderQuickPreviewProvider>
  );
}

function pluralizeTenders(count: number): string {
  const pr = new Intl.PluralRules('ru-RU');
  const rule = pr.select(count);
  switch (rule) {
    case 'one':
      return 'тендер';
    case 'few':
      return 'тендера';
    default:
      return 'тендеров';
  }
}

function TendersGridSkeleton() {
  return (
    <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className='border-border bg-card h-40 animate-pulse rounded-lg border' />
      ))}
    </ul>
  );
}
