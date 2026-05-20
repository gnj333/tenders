import Link from 'next/link';

import { LogIn } from 'lucide-react';

import { siteConfig } from '@/shared/config';

import { NotificationsBell } from '@/entities/notification';
import { ThemeToggle } from '@/features/theme';

import { Button } from '@/components/ui/button';

import { HeaderNav } from './header-nav';

export function Header() {
  return (
    <header className='sticky top-0 z-40 w-full px-4 pt-3 sm:pt-4' role='banner'>
      <div
        className={[
          'mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-3 sm:px-4',
          // glass-эффект
          'border-border/60 bg-surface/55 supports-[backdrop-filter]:bg-surface/40 rounded-2xl border shadow-sm backdrop-blur-xl',
        ].join(' ')}
      >
        <Link
          href='/'
          className='text-text hover:text-primary flex items-center gap-2 font-semibold transition-colors'
          aria-label={`${siteConfig.name} — на главную`}
        >
          <span aria-hidden className='bg-primary inline-block size-2 rounded-full' />
          {siteConfig.name}
        </Link>

        <HeaderNav />

        <div className='flex items-center gap-1.5 sm:gap-2'>
          <NotificationsBell />
          <ThemeToggle />
          <Button asChild size='sm' className='ml-1 gap-1.5'>
            <Link href={siteConfig.loginHref}>
              <LogIn aria-hidden className='size-4' />
              Вход
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
