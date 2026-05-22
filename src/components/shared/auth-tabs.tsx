import Link from 'next/link';

import { cn } from '@/shared/lib';

type Props = {
  /** Currently active tab. Comes from the page itself, not from `usePathname`,
   *  so the whole component can stay a Server Component. */
  active: 'login' | 'register';
};

const TABS = [
  { key: 'login', label: 'Вход', href: '/login' },
  { key: 'register', label: 'Регистрация', href: '/register' },
] as const;

export function AuthTabs({ active }: Props) {
  return (
    <nav aria-label='Переключатель входа и регистрации' className='border-border bg-surface inline-flex rounded-lg border p-1'>
      {TABS.map((tab) => {
        const isActive = tab.key === active;

        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'min-w-[7rem] rounded-md px-4 py-1.5 text-center text-sm font-medium transition-colors',
              'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-text-secondary hover:text-text hover:bg-accent/40',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
