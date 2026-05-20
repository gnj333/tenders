import { buildMetadata } from '@/shared/seo';

import { TenderCreateForm } from '@/features/tender-create-form';

export const metadata = buildMetadata({
  title: 'Новый тендер',
  description: 'Создание нового тендера.',
  path: '/tenders/new',
  noindex: true,
});

export default function NewTenderPage() {
  return (
    <section className='mx-auto max-w-3xl px-4 py-12'>
      <header className='mb-6'>
        <h1 className='text-text text-3xl font-semibold tracking-tight'>Создать тендер</h1>
        <p className='text-text-secondary text-base'>Заполните поля, чтобы опубликовать новую возможность.</p>
      </header>

      <TenderCreateForm />
    </section>
  );
}
