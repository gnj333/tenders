import { buildMetadata } from '@/shared/seo';

export const metadata = buildMetadata({
  title: 'Вход',
  description: 'Войдите в личный кабинет, чтобы отслеживать тендеры и подавать заявки.',
  path: '/login',
});

export default function LoginPage() {
  return (
    <section className='mx-auto flex max-w-md flex-col gap-6 px-4 py-16'>
      <h1 className='text-text text-3xl font-semibold tracking-tight'>Вход</h1>
      <p className='text-text-secondary text-base leading-relaxed'>
        Здесь скоро появится форма входа. Сейчас это страница-заглушка.
      </p>
    </section>
  );
}
