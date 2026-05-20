'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  type TenderCreateFormValues,
  type TenderCreateInput,
  TenderCreateInputSchema,
  useCreateTenderMutation,
} from '@/entities/tender';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DEFAULT_VALUES: TenderCreateFormValues = {
  title: '',
  summary: '',
  description: '',
  budget: 0,
  currency: 'RUB',
  deadline: '',
  category: '',
  organization: '',
};

export function TenderCreateForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateTenderMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    // `TenderCreateFormValues` is the pre-coercion shape (e.g. budget is a
    // string from an <input type='number'>), and `TenderCreateInput` is what
    // Zod produces after coercion. RHF works with the input shape; the
    // resolver coerces to the output shape on submit.
  } = useForm<TenderCreateFormValues, unknown, TenderCreateInput>({
    resolver: zodResolver(TenderCreateInputSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  // React Compiler warns that `watch()` returns non-memoizable values. That is
  // intentional here — we want re-renders on currency changes to drive Select.
  // eslint-disable-next-line react-hooks/incompatible-library
  const currency = watch('currency');

  const onSubmit = (values: TenderCreateInput) => {
    mutate(values, {
      onSuccess: (created) => {
        router.push(`/tenders/${created.id}` as never);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
      <Field id='title' label='Название' error={errors.title?.message}>
        <Input id='title' aria-invalid={!!errors.title} {...register('title')} />
      </Field>

      <Field id='summary' label='Краткое описание' error={errors.summary?.message}>
        <Input id='summary' aria-invalid={!!errors.summary} {...register('summary')} />
      </Field>

      <Field id='description' label='Подробное описание' error={errors.description?.message}>
        <textarea
          id='description'
          aria-invalid={!!errors.description}
          {...register('description')}
          rows={5}
          className='border-input bg-surface text-text placeholder:text-text-secondary focus-visible:ring-ring/50 focus-visible:border-ring aria-invalid:border-destructive aria-invalid:ring-destructive/30 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:ring-[3px]'
        />
      </Field>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Field id='budget' label='Бюджет' error={errors.budget?.message}>
          <Input id='budget' type='number' min={0} step={1000} aria-invalid={!!errors.budget} {...register('budget')} />
        </Field>
        <Field id='currency' label='Валюта' error={errors.currency?.message}>
          <Select
            value={currency}
            onValueChange={(v) => setValue('currency', v as TenderCreateFormValues['currency'], { shouldValidate: true })}
          >
            <SelectTrigger id='currency' aria-invalid={!!errors.currency}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='RUB'>RUB</SelectItem>
              <SelectItem value='USD'>USD</SelectItem>
              <SelectItem value='EUR'>EUR</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Field id='deadline' label='Срок подачи (ISO дата-время)' error={errors.deadline?.message}>
          <Input
            id='deadline'
            placeholder='2026-12-31T17:00:00.000Z'
            aria-invalid={!!errors.deadline}
            {...register('deadline')}
          />
        </Field>
        <Field id='category' label='Категория' error={errors.category?.message}>
          <Input id='category' aria-invalid={!!errors.category} {...register('category')} />
        </Field>
      </div>

      <Field id='organization' label='Организация-заказчик' error={errors.organization?.message}>
        <Input id='organization' aria-invalid={!!errors.organization} {...register('organization')} />
      </Field>

      {error ? (
        <p role='alert' className='text-destructive text-sm'>
          Не удалось создать тендер. Проверьте значения и попробуйте ещё раз.
        </p>
      ) : null}

      <div className='flex items-center justify-end gap-2'>
        <Button type='button' variant='ghost' onClick={() => router.back()} disabled={isPending}>
          Отмена
        </Button>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Создание…' : 'Создать тендер'}
        </Button>
      </div>
    </form>
  );
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
