import { type NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE } from './app/api/auth/_lib/constants';

/**
 * Auth middleware.
 *
 * Currently a scaffold: `config.matcher` is intentionally empty, so this
 * function is NEVER invoked at runtime. The implementation is ready for the
 * moment we add protected routes — at that point, add their paths to the
 * matcher below and the redirect logic will start working.
 *
 * Why match-but-don't-run vs. delete: keeping the file ensures one obvious
 * place to wire protection later, and avoids future contributors duplicating
 * cookie logic in random server components.
 *
 * Note: the session cookie is HTTP-only and opaque. This check is a "has
 * cookie? -> probably logged in" gate, not a real auth check — the API still
 * validates the session on every request. That's the standard pattern and is
 * intentional (we don't want middleware to make a DB call on every nav).
 */
export function middleware(request: NextRequest): NextResponse {
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname + request.nextUrl.search);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Add protected route patterns to `matcher` when needed, e.g.:
 *
 *     matcher: ['/dashboard/:path*', '/tenders/new']
 *
 * An empty array disables the middleware while keeping the file in place.
 *
 * Next.js requires `config` to be a statically analyzable plain object —
 * no `as` casts, no spreads, no computed keys.
 */
export const config = {
  matcher: [],
};
