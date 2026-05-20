'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import { Moon, Sun } from 'lucide-react';

import { cn } from '@/shared/lib';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Защита от SSR-гидрации: тема становится доступна только на клиенте.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <SwitchPrimitive.Root
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      aria-label='Переключить тему'
      data-no-theme-transition
      className={cn(
        'peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs outline-none',
        'transition-colors duration-300 ease-out',
        'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-border/80',
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'theme-toggle-thumb',
          'bg-surface pointer-events-none rounded-full shadow-sm ring-0',
          // Иконки позиционируем абсолютно внутри thumb
          'relative',
        )}
      >
        {/* Sun прижата к левому краю thumb */}
        <Sun
          aria-hidden
          className={cn(
            'text-primary absolute top-1/2 left-1 size-3 -translate-y-1/2',
            'transition-opacity duration-200 ease-out',
            isDark ? 'opacity-0' : 'opacity-100',
          )}
        />
        {/* Moon прижата к правому краю thumb */}
        <Moon
          aria-hidden
          className={cn(
            'text-primary absolute top-1/2 right-1 size-3 -translate-y-1/2',
            'transition-opacity duration-200 ease-out',
            isDark ? 'opacity-100' : 'opacity-0',
          )}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}
