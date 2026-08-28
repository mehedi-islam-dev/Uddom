import { NextRequest, NextResponse } from 'next/server';

const EXPECTED_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'admin-secret-token';

/**
 * Validates the admin_token cookie on an incoming API request.
 * Returns null if authenticated, or a 401 NextResponse if not.
 *
 * Usage:
 *   const authError = requireAdminAuth(request);
 *   if (authError) return authError;
 */
export function requireAdminAuth(request: NextRequest): NextResponse | null {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || token !== EXPECTED_TOKEN) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }
  return null; // authenticated
}
