import { env } from './env';

export const siteConfig = {
  name: 'Тендеры',
  shortName: 'Тендеры',
  description: 'Поиск, сравнение и подача заявок на государственные тендеры в одном месте.',
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: 'ru_RU',
  ogImage: '/og.png',
  twitterHandle: '@tenders',
  keywords: ['тендеры', 'госзакупки', 'торги', 'закупки', 'rfp', 'аукционы'],
  nav: [
    { label: 'Главная', href: '/' as const },
    { label: 'Тендеры', href: '/tenders' as const },
    { label: 'О сервисе', href: '/about' as const },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
