'use client';

import { Bell } from 'lucide-react';

import { cn } from '@/shared/lib';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { useNotificationsQuery } from '../api/use-notifications';

export function NotificationsBell() {
  const { data } = useNotificationsQuery();
  const unread = data?.unread ?? 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={`Уведомления (непрочитанных: ${unread})`} className='relative'>
          <Bell className='size-4' />
          {unread > 0 ? (
            <span
              aria-hidden
              className={cn(
                'bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold',
              )}
            >
              {unread > 9 ? '9+' : unread}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Уведомления</DialogTitle>
          <DialogDescription>{unread > 0 ? `Непрочитанных: ${unread}` : 'Все уведомления просмотрены.'}</DialogDescription>
        </DialogHeader>

        <ul className='max-h-96 space-y-2 overflow-auto'>
          {(data?.items ?? []).map((n) => (
            <li
              key={n.id}
              className={cn('border-border rounded-md border p-3 text-sm', !n.read && 'bg-soft-accent/40 border-primary/30')}
            >
              <p className='text-text font-medium'>{n.title}</p>
              <p className='text-text-secondary mt-1 text-xs'>{n.body}</p>
            </li>
          ))}
          {data && data.items.length === 0 ? (
            <li className='text-text-secondary py-8 text-center text-sm'>Здесь пока ничего нет.</li>
          ) : null}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
