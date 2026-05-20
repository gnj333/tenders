import { cn } from '@/shared/lib';

import type { TenderStatus } from '../model/tender.schema';

const STYLES: Record<TenderStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  open: 'bg-soft-accent text-primary',
  closed: 'bg-border text-text-secondary',
  awarded: 'bg-primary text-primary-foreground',
};

const LABEL: Record<TenderStatus, string> = {
  draft: 'Черновик',
  open: 'Открыт',
  closed: 'Закрыт',
  awarded: 'Завершён',
};

type Props = {
  status: TenderStatus;
  className?: string;
};

export function TenderStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        STYLES[status],
        className,
      )}
    >
      {LABEL[status]}
    </span>
  );
}
