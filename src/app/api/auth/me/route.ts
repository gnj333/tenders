import { type NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE } from '../_lib/session-cookie';
import { getPublicUser, getSession } from '../_lib/store';

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = getPublicUser(session.userId);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(user);
}
