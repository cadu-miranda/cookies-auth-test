import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(`http://localhost:3333/api/auth/sign-in`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  const res = NextResponse.json(data, { status: response.status });

  const setCookie = response.headers.get('set-cookie');

  if (setCookie) {
    res.headers.set('set-cookie', setCookie);
  }

  return res;
}
