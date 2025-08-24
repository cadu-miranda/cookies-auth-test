import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);

  const qs = url.searchParams.toString();

  let cookieHeader = req.headers.get('cookie') ?? '';

  if (!cookieHeader) {
    const jar = await cookies();
    cookieHeader = jar
      .getAll()
      .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
      .join('; ');
  }

  const response = await fetch(`${process.env.API_URL}/auth/sessions?${qs}`, {
    method: 'GET',
    headers: { Cookie: cookieHeader },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}
