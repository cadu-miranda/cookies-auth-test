import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookie = req.headers.get?.('cookie') ?? '';

  const response = await fetch(`http://localhost:3333/api/auth/revoke-others`, {
    method: 'POST',
    headers: { cookie },
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
