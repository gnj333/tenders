import type { NextResponse } from 'next/server';

import { SESSION_COOKIE } from './constants';

import 'server-only';

export { SESSION_COOKIE };

type CookieOptions = Parameters<NextResponse['cookies']['set']>[2];

export function setSessionCookie(res: NextResponse, value: string, maxAgeSeconds: number): void {
  const options: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeSeconds,
  };
  res.cookies.set(SESSION_COOKIE, value, options);
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}
