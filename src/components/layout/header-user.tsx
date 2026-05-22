'use client';

import Link from 'next/link';

import { LogIn, LogOut, UserRound } from 'lucide-react';

import { useLogoutMutation, useMeQuery } from '@/entities/user';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

/**
 * Header authentication island.
 *
 * Anonymous: link to `/login`.
 * Authenticated: avatar-style trigger that opens a popover with the user's
 *                name, email, and a logout button.
 *
 * While `useMeQuery` is loading on first render we show the anonymous state
 * to avoid layout shift — the data resolves in tens of ms once cookies are
 * present.
 */
export function HeaderUser() {
  const { data: user, isPending } = useMeQuery();
  const logout = useLogoutMutation();

  if (isPending || !user) {
    return (
      <Button asChild size='sm' className='ml-1 gap-1.5'>
        <Link href='/login'>
          <LogIn aria-hidden className='size-4' />
          Вход
        </Link>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='ml-1 gap-2' aria-label={`Аккаунт ${user.name}`}>
          <UserRound aria-hidden className='size-4' />
          <span className='max-w-[8rem] truncate'>{user.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-64 p-3'>
        <div className='mb-3 flex flex-col gap-0.5'>
          <p className='text-text text-sm font-medium'>{user.name}</p>
          <p className='text-text-secondary truncate text-xs'>{user.email}</p>
        </div>
        <Button
          variant='outline'
          size='sm'
          className='w-full justify-center gap-2'
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          <LogOut aria-hidden className='size-4' />
          {logout.isPending ? 'Выход…' : 'Выйти'}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
