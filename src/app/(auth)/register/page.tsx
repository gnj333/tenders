import Link from 'next/link';

import { buildMetadata } from '@/shared/seo';

import { AuthRegisterForm } from '@/features/auth-register-form';

import { AuthTabs } from '@/components/shared/auth-tabs';

export const metadata = buildMetadata({
  title: 'Регистрация',
  description: 'Создайте аккаунт, чтобы получать уведомления о новых тендерах и подавать заявки в один клик.',
  path: '/register',
});

export default function RegisterPage() {
  return (
    <>
      <header className='flex flex-col items-center gap-6 text-center'>
        <AuthTabs active='register' />
        <h1 className='text-text text-3xl font-semibold tracking-tight'>Регистрация</h1>
        <p className='text-text-secondary text-base leading-relaxed'>
          Заполните данные — мы пришлём код подтверждения на указанный email.
        </p>
      </header>

      <AuthRegisterForm />

      <p className='text-text-secondary text-center text-sm'>
        Уже есть аккаунт?{' '}
        <Link href='/login' className='text-primary font-medium hover:underline'>
          Войти
        </Link>
      </p>
    </>
  );
}
