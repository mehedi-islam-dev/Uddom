import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n';

// next-intl routing middleware for locale handling
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

// Protected admin path segment — any route that includes /admin/ sub-paths
// but NOT the login page itself requires authentication.
function isAdminRoute(pathname: string): boolean {
  // Matches /<locale>/admin or /<locale>/admin/*
  return /^\/[a-z]{2}\/admin(\/|$)/.test(pathname);
}

function isLoginRoute(pathname: string): boolean {
  // Matches /<locale>/admin/login
  return /^\/[a-z]{2}\/admin\/login(\/|$)/.test(pathname);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Auth guard for admin routes ---
  if (isAdminRoute(pathname)) {
    const token = req.cookies.get('admin_token')?.value;
    const expectedToken = process.env.ADMIN_SECRET_TOKEN || 'admin-secret-token';
    const isAuthenticated = token === expectedToken;

    if (!isAuthenticated && !isLoginRoute(pathname)) {
      // Redirect unauthenticated users to the locale-prefixed login page
      const locale = pathname.split('/')[1] || defaultLocale;
      const loginUrl = new URL(`/${locale}/admin/login`, req.url);
      // Preserve the intended destination for post-login redirect
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && isLoginRoute(pathname)) {
      // Already logged in — redirect away from login page
      const locale = pathname.split('/')[1] || defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/admin/teachers`, req.url));
    }

    // For authenticated admin routes, pass through (skip intl middleware
    // to avoid re-processing, but still call it to keep locale headers)
    return intlMiddleware(req);
  }

  // --- For all other routes, run next-intl middleware ---
  return intlMiddleware(req);
}

export const config = {
  // Match all routes except static files, api routes, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};