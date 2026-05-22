'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useRegisterStartMutation, useRegisterVerifyMutation } from '@/entities/user';

import type { RegisterStep } from '../model/state';

import { CredentialsStep } from './credentials-step';
import { VerifyStep } from './verify-step';

export function AuthRegisterForm() {
  const router = useRouter();
  const [step, setStep] = React.useState<RegisterStep>({ kind: 'credentials' });

  const startMutation = useRegisterStartMutation();
  const verifyMutation = useRegisterVerifyMutation();

  if (step.kind === 'credentials') {
    return (
      <CredentialsStep
        isPending={startMutation.isPending}
        error={startMutation.error}
        onSubmit={(values) => {
          startMutation.mutate(
            { name: values.name, email: values.email, password: values.password },
            {
              onSuccess: (data) => {
                setStep({
                  kind: 'verify',
                  challengeId: data.challengeId,
                  email: data.email,
                  expiresAt: Date.now() + data.expiresInSec * 1000,
                });
              },
            },
          );
        }}
      />
    );
  }

  return (
    <VerifyStep
      email={step.email}
      expiresAt={step.expiresAt}
      isPending={verifyMutation.isPending}
      error={verifyMutation.error}
      onBack={() => {
        verifyMutation.reset();
        setStep({ kind: 'credentials' });
      }}
      onSubmit={(code) => {
        verifyMutation.mutate(
          { challengeId: step.challengeId, code },
          {
            onSuccess: () => {
              router.push('/');
              router.refresh();
            },
          },
        );
      }}
    />
  );
}
