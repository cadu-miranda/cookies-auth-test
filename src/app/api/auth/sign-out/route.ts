import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookie = req.headers.get?.('cookie') ?? '';

  const response = await fetch(`http://localhost:3333/api/auth/sign-out`, {
    method: 'POST',
    credentials: 'include',
    headers: { cookie },
  });

  const data = await response.json().catch(() => ({}));

  const res = NextResponse.json(data, { status: response.status });

  const setCookie = response.headers.get('set-cookie');

  if (setCookie) {
    res.headers.set('set-cookie', setCookie);
  }

  return res;
}
