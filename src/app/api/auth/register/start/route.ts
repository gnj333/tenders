import { type NextRequest, NextResponse } from 'next/server';

import { RegisterStartPayloadSchema } from '@/entities/user';

import { CHALLENGE_TTL_SECONDS, createRegisterChallenge, findUserByEmail } from '../../_lib/store';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = RegisterStartPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  }

  await new Promise((r) => setTimeout(r, 250));

  if (findUserByEmail(parsed.data.email)) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
  }

  const { challenge, code } = createRegisterChallenge(parsed.data);

  // No real email service yet — log the code so devs can copy it from the
  // terminal / Vercel Runtime Logs. Replace with a real send when the backend
  // is ready. Prefix is grep-friendly: `vercel logs --follow | grep '\[OTP\]'`.
  // eslint-disable-next-line no-console
  console.log(`[OTP] email=${challenge.email} code=${code} challengeId=${challenge.id}`);

  return NextResponse.json(
    {
      challengeId: challenge.id,
      email: challenge.email,
      expiresInSec: CHALLENGE_TTL_SECONDS,
    },
    { status: 202 },
  );
}
