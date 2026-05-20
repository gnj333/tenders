import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className='mx-auto max-w-3xl px-4 py-24 text-center'>
      <h1 className='text-text text-3xl font-semibold tracking-tight'>Тендер не найден</h1>
      <p className='text-text-secondary mt-2 text-base'>Запрошенный тендер не существует или был удалён.</p>
      <div className='mt-6'>
        <Button asChild>
          <Link href='/tenders'>К списку тендеров</Link>
        </Button>
      </div>
    </section>
  );
}
