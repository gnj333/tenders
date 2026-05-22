'use client';

import { useState } from 'react';
import Link from 'next/link';

import { ChevronDown } from 'lucide-react';

import { siteConfig } from '@/shared/config';
import { cn } from '@/shared/lib';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const itemClass = cn(
  'inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-3 py-2 text-sm font-medium',
  'text-text-secondary hover:text-text focus:text-text',
  'transition-colors outline-none',
  'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'data-[state=open]:text-text',
);

export function HeaderNav() {
  return (
    <nav aria-label='Основная навигация' className='hidden md:block'>
      <ul className='flex items-center gap-1'>
        {siteConfig.nav.map((item) => {
          if ('items' in item) {
            return (
              <li key={item.label}>
                <NavPopover label={item.label} items={item.items} />
              </li>
            );
          }

          return (
            <li key={item.label}>
              <Link href={item.href} className={itemClass}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type NavPopoverProps = {
  label: string;
  items: ReadonlyArray<{ title: string; description: string; href: string }>;
};

function NavPopover({ label, items }: NavPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(itemClass, 'group')} aria-label={label}>
        {label}
        <ChevronDown
          aria-hidden
          className='relative top-px size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180'
        />
      </PopoverTrigger>
      <PopoverContent align='start' sideOffset={12} className='w-[28rem] p-2'>
        <ul className='grid gap-1 sm:grid-cols-2'>
          {items.map((child) => (
            <li key={child.title}>
              <Link
                href={child.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex flex-col gap-1 rounded-md p-3 text-sm leading-none no-underline transition-colors outline-none select-none',
                  'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
                  'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                )}
              >
                <span className='text-text text-sm font-medium'>{child.title}</span>
                <span className='text-text-secondary mt-1 text-xs leading-snug'>{child.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
