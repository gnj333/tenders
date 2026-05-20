'use client';

import Link from 'next/link';

import { siteConfig } from '@/shared/config';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export function HeaderNav() {
  return (
    <NavigationMenu className='hidden md:flex' aria-label='Основная навигация'>
      <NavigationMenuList>
        {siteConfig.nav.map((item) => {
          if ('items' in item) {
            return (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='mt-1 grid w-[28rem] gap-1 p-2 sm:grid-cols-2'>
                    {item.items.map((child) => (
                      <li key={child.title}>
                        <NavigationMenuLink asChild>
                          <Link href={child.href} className='block'>
                            <div className='text-text text-sm font-medium'>{child.title}</div>
                            <p className='text-text-secondary mt-1 text-xs leading-snug'>{child.description}</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href={item.href}>{item.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
