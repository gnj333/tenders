'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { ApiError } from '@/shared/api';

import { RegisterVerifyInputSchema } from '@/entities/user';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CodeSchema = RegisterVerifyInputSchema.pick({ code: true });
type CodeFormValues = { code: string };

type Props = {
  email: string;
  expiresAt: number;
  isPending: boolean;
  error: unknown;
  onBack: () => void;
  onSubmit: (code: string) => void;
};

export function VerifyStep({ email, expiresAt, isPending, error, onBack, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeFormValues>({
    resolver: zodResolver(CodeSchema),
    defaultValues: { code: '' },
    mode: 'onSubmit',
  });

  const secondsLeft = useCountdown(expiresAt);
  const message = formatError(error);
  const expired = secondsLeft <= 0;

  return (
    <form onSubmit={handleSubmit((v) => onSubmit(v.code))} className='flex flex-col gap-5' noValidate>
      <p className='text-text-secondary text-sm'>
        Мы отправили 6-значный код на <span className='text-text font-medium'>{email}</span>. Введите его, чтобы завершить
        регистрацию.
      </p>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='register-code'>Код из письма</Label>
        <Input
          id='register-code'
          inputMode='numeric'
          autoComplete='one-time-code'
          maxLength={6}
          aria-invalid={!!errors.code}
          // Centered, monospaced, large — typical OTP look.
          className='text-center font-mono text-lg tracking-[0.4em]'
          placeholder='000000'
          {...register('code')}
        />
        {errors.code ? (
          <p role='alert' className='text-destructive text-xs'>
            {errors.code.message}
          </p>
        ) : (
          <p className='text-text-secondary text-xs'>
            {expired
              ? 'Срок действия кода истёк — начните регистрацию заново.'
              : `Код действителен ещё ${formatCountdown(secondsLeft)}.`}
          </p>
        )}
      </div>

      {message ? (
        <p role='alert' className='text-destructive text-sm'>
          {message}
        </p>
      ) : null}

      <Button type='submit' size='lg' disabled={isPending || expired}>
        {isPending ? 'Проверка…' : 'Подтвердить и войти'}
      </Button>

      <button
        type='button'
        onClick={onBack}
        className='text-text-secondary hover:text-text text-sm underline-offset-4 transition-colors hover:underline'
      >
        Изменить email или пароль
      </button>
    </form>
  );
}

function useCountdown(expiresAt: number): number {
  const [secondsLeft, setSecondsLeft] = React.useState(() => Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));

  React.useEffect(() => {
    const tick = () => setSecondsLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);

    return () => window.clearInterval(id);
  }, [expiresAt]);

  return secondsLeft;
}

function formatCountdown(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;

  return `${m}:${String(r).padStart(2, '0')}`;
}

function formatError(error: unknown): string | null {
  if (!error) return null;
  if (error instanceof ApiError) {
    if (error.status === 422) {
      const attempts = readAttemptsLeft(error.payload);

      return attempts !== null ? `Неверный код. Осталось попыток: ${attempts}.` : 'Неверный код.';
    }
    if (error.status === 410) return 'Срок действия кода истёк. Начните регистрацию заново.';
    if (error.status === 429) return 'Слишком много попыток. Начните регистрацию заново.';
    if (error.status === 404) return 'Сессия регистрации не найдена. Начните заново.';

    return 'Не удалось подтвердить код. Попробуйте позже.';
  }

  return 'Не удалось подтвердить код. Попробуйте позже.';
}

function readAttemptsLeft(payload: unknown): number | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const v = (payload as { attemptsLeft?: unknown }).attemptsLeft;

  return typeof v === 'number' ? v : null;
}
