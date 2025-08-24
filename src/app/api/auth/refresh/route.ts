import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookie = req.headers.get?.('cookie') ?? '';

  const resp = await fetch(`http://localhost:3333/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { cookie },
  });

  const data = await resp.json().catch(() => ({}));

  const res = NextResponse.json(data, { status: resp.status });

  const setCookie = resp.headers.get('set-cookie');

  if (setCookie) {
    res.headers.set('set-cookie', setCookie);
  }

  return res;
}
