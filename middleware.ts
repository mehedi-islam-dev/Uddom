import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    if (path.includes('/admin')) {

        const isLoginPage = path.endsWith('/admin') || path.endsWith('/admin/login');

        const token = req.cookies.get('admin_token')?.value;

        if (!token && !isLoginPage) {
            const locale = path.split('/')[1] || 'en';
            return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
        }

        if (token && isLoginPage) {

            const locale = path.split('/')[1] || 'en';
            return NextResponse.redirect(new URL(`/${locale}/admin/teachers`, req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};