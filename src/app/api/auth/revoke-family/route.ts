import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookie = req.headers.get?.('cookie') ?? '';

  const body = await req.json();

  const response = await fetch(`http://localhost:3333/api/auth/revoke-family`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
