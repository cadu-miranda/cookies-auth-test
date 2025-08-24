import { NextResponse, NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const path = url.pathname;

  const hasAccessToken = request.cookies.get('access_token');

  const hasRefreshToken = request.cookies.get('refresh_token');

  const isAuthenticated = Boolean(hasAccessToken || hasRefreshToken);

  // Caso esteja na home e o usuário esteja autenticado, redireciona para o dashboard.

  if (path === '/' && isAuthenticated) {
    url.pathname = '/dashboard/users';

    return NextResponse.redirect(url);
  }

  // Se a rota protegida for acessada

  const wantsProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));

  if (wantsProtected) {
    // Tenta refresh se não houver token de acesso mas existir o refresh token

    if (!hasAccessToken && hasRefreshToken) {
      const refreshResponse = await fetch(
        new URL('http://localhost:3333/api/auth/refresh', request.url),
        {
          method: 'POST',
          headers: { cookie: request.headers.get('cookie') ?? '' },
          credentials: 'include',
        },
      );

      if (refreshResponse.ok) {
        const response = NextResponse.next();

        const setCookie = refreshResponse.headers.get('set-cookie');

        if (setCookie) {
          response.headers.set('set-cookie', setCookie);
        }

        return response;
      }
    }

    // Se não houver tokens (ou falhou no refresh), redireciona para a home.

    if (!hasAccessToken && !hasRefreshToken) {
      url.pathname = '/';

      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/', '/dashboard/:path*'] };
