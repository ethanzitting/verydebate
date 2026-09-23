import { timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { hasSession, setSessionCookie } from '@/app/lib/session';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  return NextResponse.json(
    { authenticated: hasSession(request) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: NextRequest) {
  const configuredPassword = process.env.DEBATE_PASSWORD;
  if (!configuredPassword) {
    return NextResponse.json(
      { error: 'DEBATE_PASSWORD is not configured.' },
      { status: 503 },
    );
  }

  let suppliedPassword: unknown;
  try {
    suppliedPassword = (await request.json()).password;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const expected = Buffer.from(configuredPassword);
  const actual = Buffer.from(
    typeof suppliedPassword === 'string' ? suppliedPassword : '',
  );
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  setSessionCookie(response);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
