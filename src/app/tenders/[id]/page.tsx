import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ApiError } from '@/shared/api';
import { breadcrumbsJsonLd, buildMetadata, jsonLd } from '@/shared/seo';

import { formatBudget, formatDeadline, TenderStatusBadge } from '@/entities/tender';
import { getTenderById } from '@/entities/tender/server';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  try {
    const tender = await getTenderById(id);

    return buildMetadata({
      title: tender.title,
      description: tender.summary,
      path: `/tenders/${tender.id}`,
      type: 'article',
    });
  } catch {
    return buildMetadata({ title: 'Тендер не найден', path: `/tenders/${id}`, noindex: true });
  }
}

export default async function TenderPage({ params }: Props) {
  const { id } = await params;
  const tender = await getTenderById(id).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  const articleJsonLd = jsonLd({
    '@type': 'Article',
    headline: tender.title,
    description: tender.summary,
    datePublished: tender.publishedAt,
    dateModified: tender.publishedAt,
    author: { '@type': 'Organization', name: tender.organization },
  });

  const breadcrumbs = breadcrumbsJsonLd([
    { name: 'Главная', href: '/' },
    { name: 'Тендеры', href: '/tenders' },
    { name: tender.title, href: `/tenders/${tender.id}` },
  ]);

  return (
    <>
      <article className='mx-auto max-w-3xl px-4 py-12'>
        <nav aria-label='Хлебные крошки' className='text-text-secondary mb-4 text-xs'>
          <ol className='flex flex-wrap items-center gap-1'>
            <li>
              <Link href='/' className='hover:text-text'>
                Главная
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href='/tenders' className='hover:text-text'>
                Тендеры
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className='text-text truncate'>{tender.title}</li>
          </ol>
        </nav>

        <header className='flex flex-col gap-3'>
          <div className='flex items-center gap-3'>
            <TenderStatusBadge status={tender.status} />
            <span className='text-text-secondary text-xs'>{tender.category}</span>
          </div>
          <h1 className='text-text text-3xl leading-tight font-semibold tracking-tight'>{tender.title}</h1>
          <p className='text-text-secondary text-base'>{tender.summary}</p>
        </header>

        <dl className='border-border mt-8 grid grid-cols-1 gap-y-2 border-y py-6 text-sm sm:grid-cols-3'>
          <div>
            <dt className='text-text-secondary'>Бюджет</dt>
            <dd className='text-text font-medium'>{formatBudget(tender.budget, tender.currency)}</dd>
          </div>
          <div>
            <dt className='text-text-secondary'>Срок подачи</dt>
            <dd className='text-text font-medium'>{formatDeadline(tender.deadline)}</dd>
          </div>
          <div>
            <dt className='text-text-secondary'>Организация</dt>
            <dd className='text-text font-medium'>{tender.organization}</dd>
          </div>
        </dl>

        <section className='mt-8'>
          <h2 className='text-text text-xl font-semibold'>Описание</h2>
          <p className='text-text-secondary mt-2 text-base leading-relaxed'>{tender.description}</p>
        </section>
      </article>

      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: articleJsonLd }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: breadcrumbs }} />
    </>
  );
}
