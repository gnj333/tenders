import Link from 'next/link';

import { siteConfig } from '@/shared/config';

import { NotificationsBell } from '@/entities/notification';
import { ThemeToggle } from '@/features/theme';

export function Header() {
  return (
    <header
      className='border-border bg-surface/80 supports-[backdrop-filter]:bg-surface/60 sticky top-0 z-40 w-full border-b backdrop-blur'
      role='banner'
    >
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4'>
        <Link href='/' className='text-text flex items-center gap-2 font-semibold' aria-label={`${siteConfig.name} — на главную`}>
          <span aria-hidden className='bg-primary inline-block size-2 rounded-full' />
          {siteConfig.name}
        </Link>

        <nav aria-label='Основная навигация' className='text-text-secondary hidden items-center gap-6 text-sm md:flex'>
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className='hover:text-text transition-colors'>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className='flex items-center gap-2'>
          <NotificationsBell />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
