'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';

import { ApiError } from '@/shared/api';

import { type LoginInput, LoginInputSchema, useLoginMutation } from '@/entities/user';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DEFAULT_VALUES: LoginInput = { email: '', password: '' };

export function AuthLoginForm() {
  const router = useRouter();
  const { mutate, isPending, error, reset } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const onSubmit = (values: LoginInput) => {
    mutate(values, {
      onSuccess: () => {
        router.push('/');
        router.refresh();
      },
    });
  };

  const message = formatError(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5' noValidate>
      <Field id='login-email' label='Email' error={errors.email?.message}>
        <Input
          id='login-email'
          type='email'
          autoComplete='email'
          inputMode='email'
          aria-invalid={!!errors.email}
          {...register('email', { onChange: () => (error ? reset() : undefined) })}
        />
      </Field>

      <Field id='login-password' label='Пароль' error={errors.password?.message}>
        <Input
          id='login-password'
          type='password'
          autoComplete='current-password'
          aria-invalid={!!errors.password}
          {...register('password', { onChange: () => (error ? reset() : undefined) })}
        />
      </Field>

      {message ? (
        <p role='alert' className='text-destructive text-sm'>
          {message}
        </p>
      ) : null}

      <Button type='submit' size='lg' disabled={isPending}>
        {isPending ? 'Вход…' : 'Войти'}
      </Button>
    </form>
  );
}

function formatError(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Неверный email или пароль.';
    if (error.status === 400) return 'Проверьте введённые данные.';

    return 'Не удалось войти. Попробуйте позже.';
  }

  return 'Не удалось войти. Попробуйте позже.';
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role='alert' className='text-destructive text-xs'>
          {error}
        </p>
      ) : null}
    </div>
  );
}
