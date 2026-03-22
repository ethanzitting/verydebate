import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();
  const correct = process.env.DEBATE_PASSWORD;

  if (!correct) {
    return NextResponse.json(
      { error: 'DEBATE_PASSWORD not configured' },
      { status: 500 },
    );
  }

  if (password === correct) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json(
    { error: 'Wrong password' },
    { status: 401 },
  );
}
