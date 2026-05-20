import Link from 'next/link';

import { cn } from '@/shared/lib';

import { formatBudget, formatDeadline } from '../lib/format';
import type { Tender } from '../model/tender.schema';

import { TenderStatusBadge } from './tender-status-badge';

type Props = {
  tender: Tender;
  className?: string;
  /**
   * Optional interactive slot rendered above the card's full-area link.
   * Use this to place client-side buttons (e.g. quick-preview, bookmark)
   * without breaking the card's primary navigation affordance.
   */
  actionSlot?: React.ReactNode;
};

export function TenderCard({ tender, className, actionSlot }: Props) {
  const href = `/tenders/${tender.id}` as const;

  return (
    <article
      className={cn(
        'group bg-card hover:border-primary/50 relative flex flex-col gap-3 rounded-lg border p-5 shadow-sm transition-colors',
        className,
      )}
    >
      <header className='flex items-start justify-between gap-3'>
        <h3 className='text-text text-lg leading-tight font-semibold'>
          <Link href={href} className='outline-none after:absolute after:inset-0 focus-visible:underline'>
            {tender.title}
          </Link>
        </h3>
        <TenderStatusBadge status={tender.status} />
      </header>

      <p className='text-text-secondary text-sm'>{tender.summary}</p>

      <dl className='text-text-secondary mt-auto grid grid-cols-2 gap-x-4 gap-y-1 text-xs'>
        <div>
          <dt className='sr-only'>Бюджет</dt>
          <dd>
            <span className='text-text-secondary'>Бюджет: </span>
            <span className='text-text font-medium'>{formatBudget(tender.budget, tender.currency)}</span>
          </dd>
        </div>
        <div>
          <dt className='sr-only'>Срок</dt>
          <dd>
            <span className='text-text-secondary'>Срок: </span>
            <span className='text-text font-medium'>{formatDeadline(tender.deadline)}</span>
          </dd>
        </div>
        <div>
          <dt className='sr-only'>Категория</dt>
          <dd>
            <span className='text-text-secondary'>Категория: </span>
            <span className='text-text font-medium'>{tender.category}</span>
          </dd>
        </div>
        <div>
          <dt className='sr-only'>Заказчик</dt>
          <dd className='truncate'>
            <span className='text-text-secondary'>Заказчик: </span>
            <span className='text-text font-medium'>{tender.organization}</span>
          </dd>
        </div>
      </dl>

      {actionSlot ? <div className='relative z-10 mt-2 flex items-center justify-end gap-2'>{actionSlot}</div> : null}
    </article>
  );
}
