import Link from 'next/link';

import { buildMetadata } from '@/shared/seo';

import { AuthLoginForm } from '@/features/auth-login-form';

import { AuthTabs } from '@/components/shared/auth-tabs';

export const metadata = buildMetadata({
  title: 'Вход',
  description: 'Войдите в личный кабинет, чтобы отслеживать тендеры, сохранять фильтры и подавать заявки.',
  path: '/login',
});

export default function LoginPage() {
  return (
    <>
      <header className='flex flex-col items-center gap-6 text-center'>
        <AuthTabs active='login' />
        <h1 className='text-text text-3xl font-semibold tracking-tight'>Вход</h1>
        <p className='text-text-secondary text-base leading-relaxed'>
          Войдите в личный кабинет, чтобы продолжить работу с тендерами.
        </p>
      </header>

      <AuthLoginForm />

      <p className='text-text-secondary text-center text-sm'>
        Ещё нет аккаунта?{' '}
        <Link href='/register' className='text-primary font-medium hover:underline'>
          Зарегистрироваться
        </Link>
      </p>
    </>
  );
}
