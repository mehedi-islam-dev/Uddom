import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin auth guard: protect all /[locale]/admin/* routes (except login)
  const isAdminRoute = /^\/(en|bn)\/admin(?!\/login)/.test(pathname);

  if (isAdminRoute) {
    const adminToken = request.cookies.get('admin_token');
    if (!adminToken || adminToken.value !== process.env.ADMIN_SECRET_TOKEN) {
      const locale = pathname.startsWith('/bn') ? 'bn' : 'en';
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api/* (API routes)
    // - /_next/* (Next.js internals)
    // - /static/* (static files)
    // - /favicon.ico, /robots.txt etc.
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
