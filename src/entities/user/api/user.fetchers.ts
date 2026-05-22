import { cookies } from 'next/headers';

import { env } from '@/shared/config';

import { type User, UserSchema } from '@/entities/user';

import 'server-only';

/**
 * Server-side fetcher for the current user.
 *
 * Forwards the incoming session cookie to the upstream API. Returns `null`
 * on 401 so callers can render anonymous UI without try/catch.
 *
 * Only call this from server code (route handlers, server components,
 * middleware-adjacent code). Client code should use `useMeQuery`.
 */
export async function getMe(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    // The session is per-request — never cache the response.
    cache: 'no-store',
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Failed to load current user: HTTP ${res.status}`);

  return UserSchema.parse(await res.json());
}
