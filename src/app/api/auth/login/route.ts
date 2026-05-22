import { type NextRequest, NextResponse } from 'next/server';

import { LoginInputSchema } from '@/entities/user';

import { setSessionCookie } from '../_lib/session-cookie';
import { checkCredentials, createSession, SESSION_TTL_SECONDS } from '../_lib/store';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = LoginInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  }

  // Tiny artificial latency so loading states are observable in dev.
  await new Promise((r) => setTimeout(r, 250));

  const user = checkCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const session = createSession(user.id);
  const res = NextResponse.json({ user });
  setSessionCookie(res, session.id, SESSION_TTL_SECONDS);

  return res;
}
