import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'verydebate-session';
const SESSION_LENGTH_MS = 7 * 24 * 60 * 60 * 1000;

function signature(expiresAtMs: number): string {
  return createHmac('sha256', process.env.DEBATE_PASSWORD ?? '')
    .update(`verydebate-session-v1:${expiresAtMs}`)
    .digest('hex');
}

export function hasSession(request: NextRequest): boolean {
  if (!process.env.DEBATE_PASSWORD) return false;

  const value = request.cookies.get(COOKIE_NAME)?.value;
  const [expiresText, actualSignature] = value?.split('.') ?? [];
  const expiresAtMs = Number(expiresText);
  if (!expiresText || !actualSignature || !Number.isSafeInteger(expiresAtMs)) {
    return false;
  }
  if (expiresAtMs <= Date.now() || actualSignature.length !== 64) return false;

  const expected = Buffer.from(signature(expiresAtMs), 'hex');
  const actual = Buffer.from(actualSignature, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function setSessionCookie(response: NextResponse): void {
  const expiresAtMs = Date.now() + SESSION_LENGTH_MS;
  response.cookies.set(
    COOKIE_NAME,
    `${expiresAtMs}.${signature(expiresAtMs)}`,
    {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_LENGTH_MS / 1000,
    },
  );
}
