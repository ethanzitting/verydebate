import { createClient } from '@deepgram/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { hasSession } from '@/app/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!hasSession(request)) {
    return NextResponse.json(
      { error: 'Sign in to start transcription.' },
      { status: 401 },
    );
  }

  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'DEEPGRAM_API_KEY is not configured.' },
      { status: 503 },
    );
  }

  try {
    const { result, error } = await createClient(apiKey).auth.grantToken();
    if (error || !result?.access_token) {
      return NextResponse.json(
        { error: 'Deepgram could not issue a temporary token.' },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { access_token: result.access_token },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'Deepgram token request failed.' },
      { status: 502 },
    );
  }
}
