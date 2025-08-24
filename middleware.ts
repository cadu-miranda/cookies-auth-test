import { NextResponse, NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard'];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const path = url.pathname;

  const hasAccess = req.cookies.get('access_token');

  const hasRefresh = req.cookies.get('refresh_token');

  const wantsProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));

  if (wantsProtected && !hasAccess && hasRefresh) {
    const refreshResp = await fetch(
      new URL('http://localhost:3333/api/auth/refresh', req.url),
      {
        method: 'POST',
        headers: { cookie: req.headers.get('cookie') ?? '' },
        credentials: 'include',
      },
    );

    if (refreshResp.ok) {
      const res = NextResponse.next();

      const setCookie = refreshResp.headers.get('set-cookie');

      if (setCookie) {
        res.headers.set('set-cookie', setCookie);
      }

      return res;
    }
  }

  if (wantsProtected && !hasAccess && !hasRefresh) {
    url.pathname = '/';

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api/public).*)'],
};
