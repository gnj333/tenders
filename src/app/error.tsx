'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    // TODO(observability): отправить в систему мониторинга (Sentry/Otel).
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section className='mx-auto max-w-3xl px-4 py-24 text-center'>
      <h1 className='text-text text-3xl font-semibold tracking-tight'>Что-то пошло не так</h1>
      <p className='text-text-secondary mt-2 text-base'>Произошла непредвиденная ошибка. Пожалуйста, попробуйте ещё раз.</p>
      <div className='mt-6'>
        <Button onClick={reset}>Повторить</Button>
      </div>
    </section>
  );
}
