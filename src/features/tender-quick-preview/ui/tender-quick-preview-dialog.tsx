'use client';

import Link from 'next/link';

import { formatBudget, formatDeadline, TenderStatusBadge, useTenderQuery } from '@/entities/tender';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { useQuickPreview } from '../model/context';

export function TenderQuickPreviewDialog() {
  const { openId, close } = useQuickPreview();
  const isOpen = openId !== null;

  // `enabled: id.length > 0` inside the hook ensures we don't fetch until
  // a real id is selected; React-Query caches each tender by detail key.
  const { data, isLoading, error } = useTenderQuery(openId ?? '');

  return (
    <Dialog open={isOpen} onOpenChange={(v) => (v ? null : close())}>
      <DialogContent>
        {isLoading ? <PreviewSkeleton /> : null}
        {error ? <p className='text-destructive text-sm'>Не удалось загрузить тендер.</p> : null}
        {data ? (
          <>
            <DialogHeader>
              <div className='flex items-center gap-2'>
                <TenderStatusBadge status={data.status} />
                <span className='text-text-secondary text-xs'>{data.category}</span>
              </div>
              <DialogTitle>{data.title}</DialogTitle>
              <DialogDescription>{data.summary}</DialogDescription>
            </DialogHeader>

            <dl className='border-border grid grid-cols-2 gap-y-1 border-y py-3 text-sm'>
              <dt className='text-text-secondary'>Бюджет</dt>
              <dd className='text-text font-medium'>{formatBudget(data.budget, data.currency)}</dd>
              <dt className='text-text-secondary'>Срок подачи</dt>
              <dd className='text-text font-medium'>{formatDeadline(data.deadline)}</dd>
              <dt className='text-text-secondary'>Организация</dt>
              <dd className='text-text font-medium'>{data.organization}</dd>
            </dl>

            <DialogFooter>
              <Button asChild>
                <Link href={`/tenders/${data.id}`}>Открыть полностью</Link>
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function PreviewSkeleton() {
  return (
    <div className='space-y-3'>
      <Skeleton className='h-4 w-24' />
      <Skeleton className='h-6 w-3/4' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-20 w-full' />
    </div>
  );
}
