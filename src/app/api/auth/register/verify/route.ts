import { type NextRequest, NextResponse } from 'next/server';

import { RegisterVerifyInputSchema } from '@/entities/user';

import { setSessionCookie } from '../../_lib/session-cookie';
import { createSession, SESSION_TTL_SECONDS, verifyRegisterChallenge } from '../../_lib/store';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = RegisterVerifyInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  }

  await new Promise((r) => setTimeout(r, 250));

  const result = verifyRegisterChallenge(parsed.data.challengeId, parsed.data.code);

  switch (result.kind) {
    case 'not-found':
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    case 'expired':
      return NextResponse.json({ error: 'Code expired' }, { status: 410 });
    case 'locked':
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
    case 'wrong-code':
      return NextResponse.json({ error: 'Wrong code', attemptsLeft: result.attemptsLeft }, { status: 422 });
    case 'ok': {
      const session = createSession(result.user.id);
      const res = NextResponse.json({ user: result.user }, { status: 201 });
      setSessionCookie(res, session.id, SESSION_TTL_SECONDS);

      return res;
    }
  }
}
