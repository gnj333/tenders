'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { ApiError } from '@/shared/api';

import { type RegisterStartFormValues, RegisterStartInputSchema } from '@/entities/user';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DEFAULT_VALUES: RegisterStartFormValues = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

type Props = {
  isPending: boolean;
  error: unknown;
  onSubmit: (values: RegisterStartFormValues) => void;
};

export function CredentialsStep({ isPending, error, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterStartFormValues>({
    resolver: zodResolver(RegisterStartInputSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const message = formatError(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5' noValidate>
      <Field id='register-name' label='Имя' error={errors.name?.message}>
        <Input id='register-name' autoComplete='name' aria-invalid={!!errors.name} {...register('name')} />
      </Field>

      <Field id='register-email' label='Email' error={errors.email?.message}>
        <Input
          id='register-email'
          type='email'
          autoComplete='email'
          inputMode='email'
          aria-invalid={!!errors.email}
          {...register('email')}
        />
      </Field>

      <Field
        id='register-password'
        label='Пароль'
        error={errors.password?.message}
        hint='Не менее 8 символов, должен содержать буквы и цифры.'
      >
        <Input
          id='register-password'
          type='password'
          autoComplete='new-password'
          aria-invalid={!!errors.password}
          {...register('password')}
        />
      </Field>

      <Field id='register-password-confirm' label='Подтверждение пароля' error={errors.passwordConfirm?.message}>
        <Input
          id='register-password-confirm'
          type='password'
          autoComplete='new-password'
          aria-invalid={!!errors.passwordConfirm}
          {...register('passwordConfirm')}
        />
      </Field>

      {message ? (
        <p role='alert' className='text-destructive text-sm'>
          {message}
        </p>
      ) : null}

      <Button type='submit' size='lg' disabled={isPending}>
        {isPending ? 'Отправка кода…' : 'Получить код на email'}
      </Button>
    </form>
  );
}

function formatError(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof ApiError) {
    if (error.status === 409) return 'Пользователь с таким email уже зарегистрирован.';
    if (error.status === 400) return 'Проверьте введённые данные.';

    return 'Не удалось начать регистрацию. Попробуйте позже.';
  }

  return 'Не удалось начать регистрацию. Попробуйте позже.';
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role='alert' className='text-destructive text-xs'>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className='text-text-secondary text-xs'>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
