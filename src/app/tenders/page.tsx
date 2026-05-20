import Link from 'next/link';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { makeQueryClient } from '@/shared/query';
import { buildMetadata } from '@/shared/seo';

import { tenderKeys } from '@/entities/tender';
import { getTenders } from '@/entities/tender/server';
import { searchParamsToFilters, TendersList } from '@/features/tenders-filters';

import { Button } from '@/components/ui/button';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata = buildMetadata({
  title: 'Тендеры',
  description: 'Открытые и недавно опубликованные государственные тендеры.',
  path: '/tenders',
});

export default async function TendersPage({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = searchParamsToFilters(raw);

  // Prefetch on the server with the same params that will be used on the client.
  // The shared queryKey guarantees that useTendersQuery hydrates instantly.
  const qc = makeQueryClient();
  await qc.prefetchQuery({
    queryKey: tenderKeys.list(filters),
    queryFn: () => getTenders(filters),
  });

  return (
    <section className='mx-auto max-w-6xl px-4 py-12'>
      <header className='mb-6 flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h1 className='text-text text-3xl font-semibold tracking-tight'>Тендеры</h1>
          <p className='text-text-secondary text-base'>Просматривайте, фильтруйте и подавайте заявки на открытые возможности.</p>
        </div>
        <Button asChild>
          <Link href='/tenders/new'>Создать тендер</Link>
        </Button>
      </header>

      <HydrationBoundary state={dehydrate(qc)}>
        <TendersList initialFilters={filters} />
      </HydrationBoundary>
    </section>
  );
}
