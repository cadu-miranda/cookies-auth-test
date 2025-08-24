import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookie = req.headers.get?.('cookie') ?? '';

  const resp = await fetch(`http://localhost:3333/api/auth/revoke-others`, {
    method: 'POST',
    headers: { cookie },
    credentials: 'include',
  });

  const data = await resp.json().catch(() => ({}));

  return NextResponse.json(data, { status: resp.status });
}
