'use client';

import * as React from 'react';

import { TenderCard, useInfiniteTendersQuery } from '@/entities/tender';

import { Button } from '@/components/ui/button';

/**
 * Client-side infinite list. Uses `useInfiniteQuery` to accumulate pages.
 *
 * An IntersectionObserver near the end of the list triggers automatic
 * fetching of the next page when the user scrolls close to the bottom,
 * with a "Load more" button as a manual fallback.
 */
export function TendersInfiniteList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteTendersQuery({ pageSize: 2 });

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasNextPage) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isFetchingNextPage) {
            void fetchNextPage();
          }
        }
      },
      { rootMargin: '200px' },
    );

    io.observe(target);

    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const tenders = data?.pages.flatMap((p) => p.items) ?? [];

  if (isLoading) {
    return (
      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className='border-border bg-card h-40 animate-pulse rounded-lg border' />
        ))}
      </ul>
    );
  }

  if (error) return <p className='text-destructive'>Не удалось загрузить тендеры.</p>;

  return (
    <>
      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {tenders.map((t) => (
          <li key={t.id}>
            <TenderCard tender={t} />
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} aria-hidden className='h-1' />

      <div className='mt-6 flex justify-center'>
        {hasNextPage ? (
          <Button variant='outline' onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Загрузка…' : 'Показать ещё'}
          </Button>
        ) : (
          <span className='text-text-secondary text-sm'>Список закончился</span>
        )}
      </div>
    </>
  );
}
