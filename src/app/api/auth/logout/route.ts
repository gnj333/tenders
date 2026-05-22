import { type NextRequest, NextResponse } from 'next/server';

import { clearSessionCookie, SESSION_COOKIE } from '../_lib/session-cookie';
import { destroySession } from '../_lib/store';

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  destroySession(sessionId);
  const res = new NextResponse(null, { status: 204 });
  clearSessionCookie(res);

  return res;
}
