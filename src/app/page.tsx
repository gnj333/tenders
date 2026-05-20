import Link from 'next/link';

import { siteConfig } from '@/shared/config';
import { buildMetadata } from '@/shared/seo';

import { Button } from '@/components/ui/button';

export const metadata = buildMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: '/',
});

export default function HomePage() {
  return (
    <section className='mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 py-24 text-center'>
      <span className='bg-soft-accent text-secondary-foreground inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium'>
        <span aria-hidden className='bg-primary size-1.5 rounded-full' />
        Next.js 15 · React 19 · shadcn/ui
      </span>
      <h1 className='text-text text-4xl font-semibold tracking-tight sm:text-5xl'>{siteConfig.name}</h1>
      <p className='text-text-secondary max-w-xl text-base'>{siteConfig.description}</p>
      <div className='flex flex-wrap items-center justify-center gap-3'>
        <Button asChild size='lg'>
          <Link href='/tenders'>Смотреть тендеры</Link>
        </Button>
        <Button asChild size='lg' variant='outline'>
          <Link href='/about'>Подробнее</Link>
        </Button>
      </div>
    </section>
  );
}
