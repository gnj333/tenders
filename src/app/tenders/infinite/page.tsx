import { buildMetadata } from '@/shared/seo';

import { TendersInfiniteList } from '@/features/tenders-infinite';

export const metadata = buildMetadata({
  title: 'Тендеры · Бесконечная прокрутка',
  description: 'Все тендеры с бесконечной подгрузкой при прокрутке.',
  path: '/tenders/infinite',
});

/**
 * Demonstrates client-side infinite scrolling. We deliberately do NOT prefetch
 * on the server here: infinite pagination is interactive by definition and
 * does not need SSR for SEO (the canonical list page is /tenders).
 */
export default function TendersInfinitePage() {
  return (
    <section className='mx-auto max-w-6xl px-4 py-12'>
      <header className='mb-6'>
        <h1 className='text-text text-3xl font-semibold tracking-tight'>Все тендеры</h1>
        <p className='text-text-secondary text-base'>Прокручивайте вниз — следующие будут подгружаться автоматически.</p>
      </header>

      <TendersInfiniteList />
    </section>
  );
}
