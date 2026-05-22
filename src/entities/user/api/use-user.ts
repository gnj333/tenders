'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiError, http } from '@/shared/api';

import {
  type LoginInput,
  LoginInputSchema,
  type LoginResponse,
  LoginResponseSchema,
  type RegisterStartPayload,
  RegisterStartPayloadSchema,
  type RegisterStartResponse,
  RegisterStartResponseSchema,
  type RegisterVerifyInput,
  RegisterVerifyInputSchema,
  type RegisterVerifyResponse,
  RegisterVerifyResponseSchema,
  type User,
  UserSchema,
} from '@/entities/user';

import { userKeys } from './user.keys';

/* ------------------------------------------------------------------ */
/*  Plain client-side fetchers                                        */

/* ------------------------------------------------------------------ */

/**
 * Returns the current user, or `null` when no session cookie is present.
 *
 * We treat HTTP 401 as a normal "anonymous" response so React Query stays in
 * the success state — otherwise the header (which calls this on every page)
 * would render as `error` for every guest.
 */
async function fetchMe(): Promise<User | null> {
  try {
    const json = await http<unknown>('/auth/me');

    return UserSchema.parse(json);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

async function postLogin(input: LoginInput): Promise<LoginResponse> {
  const parsed = LoginInputSchema.parse(input);
  const json = await http<unknown>('/auth/login', { method: 'POST', body: parsed });

  return LoginResponseSchema.parse(json);
}

async function postLogout(): Promise<void> {
  await http<unknown>('/auth/logout', { method: 'POST' });
}

async function postRegisterStart(input: RegisterStartPayload): Promise<RegisterStartResponse> {
  const parsed = RegisterStartPayloadSchema.parse(input);
  const json = await http<unknown>('/auth/register/start', { method: 'POST', body: parsed });

  return RegisterStartResponseSchema.parse(json);
}

async function postRegisterVerify(input: RegisterVerifyInput): Promise<RegisterVerifyResponse> {
  const parsed = RegisterVerifyInputSchema.parse(input);
  const json = await http<unknown>('/auth/register/verify', { method: 'POST', body: parsed });

  return RegisterVerifyResponseSchema.parse(json);
}

/* ------------------------------------------------------------------ */
/*  Query                                                             */

/* ------------------------------------------------------------------ */

export function useMeQuery() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: fetchMe,
    // Auth state should refetch when the tab regains focus.
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    retry: false,
  });
}

/* ------------------------------------------------------------------ */
/*  Mutations                                                         */

/* ------------------------------------------------------------------ */

export function useLoginMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: postLogin,
    onSuccess: ({ user }) => {
      qc.setQueryData(userKeys.me(), user);
    },
  });
}

export function useLogoutMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      qc.setQueryData(userKeys.me(), null);
      // Anything user-scoped (notifications, dashboard, etc.) must drop.
      qc.removeQueries({ queryKey: userKeys.all, exact: false });
      // Re-seed `me` with null so the header doesn't briefly flicker to a fetch.
      qc.setQueryData(userKeys.me(), null);
    },
  });
}

export function useRegisterStartMutation() {
  return useMutation({
    mutationFn: postRegisterStart,
  });
}

export function useRegisterVerifyMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: postRegisterVerify,
    onSuccess: ({ user }) => {
      qc.setQueryData(userKeys.me(), user);
    },
  });
}
