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
    { label: 'Поиск', href: '/tenders' as const },
    {
      label: 'Возможности',
      items: [
        {
          title: 'Умный поиск',
          description: 'Фильтры по отрасли, региону, бюджету и срокам — за секунды.',
          href: '/tenders' as const,
        },
        {
          title: 'Уведомления',
          description: 'Email и push о новых тендерах по вашим критериям.',
          href: '/about' as const,
        },
        {
          title: 'Аналитика',
          description: 'История цен, статистика заказчиков и победителей.',
          href: '/about' as const,
        },
        {
          title: 'Выгрузка данных',
          description: 'Экспорт результатов в Excel и CSV для дальнейшей работы.',
          href: '/about' as const,
        },
        {
          title: 'API для интеграций',
          description: 'Подключите тендеры к своей CRM или внутренним системам.',
          href: '/about' as const,
        },
        {
          title: 'О сервисе',
          description: 'Как сервис устроен и кому он подходит.',
          href: '/about' as const,
        },
      ],
    },
    { label: 'Контакты', href: '/contacts' as const },
  ],
  loginHref: '/login' as const,
} as const;

export type SiteConfig = typeof siteConfig;
