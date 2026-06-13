import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Country detection constants ────────────────────────────────────────────
const EU_CODES = new Set([
  'DE','FR','IT','ES','NL','BE','AT','PT','GR','IE','FI','SE','DK','PL','CZ','RO','HU',
]);
const SUPPORTED_COUNTRY_CODES = new Set(['US', 'GB', 'EU', 'IN']);

function resolveCountry(req: NextRequest): string {
  // Cloudflare sets this header in production automatically — free, no extra API call
  const cf = req.headers.get('cf-ipcountry') ?? '';
  const raw = cf.toUpperCase();
  if (EU_CODES.has(raw)) return 'EU';
  if (SUPPORTED_COUNTRY_CODES.has(raw)) return raw;
  return 'IN'; // default
}

// ─── Protected route definitions ─────────────────────────────────────────────
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['admin'],
  '/admin/courses': ['admin'],
  '/admin/students': ['admin'],
  '/admin/content': ['admin'],
  '/admin/categories': ['admin'],
  '/admin/revenue': ['admin'],
  '/admin/settings': ['admin'],
  '/admin/instructors': ['admin'],
  '/dashboard': ['instructor', 'user', 'student'],
  '/dashboard/settings': ['instructor', 'user', 'student'],
  '/dashboard/courses': ['instructor', 'user', 'student'],
  '/dashboard/payments': ['user', 'student'],
  '/dashboard/profile': ['instructor', 'user', 'student'],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ── Step 1: Country detection (runs for every page request) ─────────────
  // Only set if not already cached — respects manual overrides and avoids
  // unnecessary cookie writes on every request.
  if (!req.cookies.get('user_country')?.value) {
    const country = resolveCountry(req);
    res.cookies.set('user_country', country, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
      httpOnly: false, // client JS needs to read it via document.cookie
    });
  }

  // ── Step 2: Auth (only for protected routes) ─────────────────────────────
  const currentPath = req.nextUrl.pathname;
  const needsAuth =
    currentPath.startsWith('/admin') ||
    currentPath.startsWith('/dashboard') ||
    currentPath.startsWith('/auth');

  if (!needsAuth) return res;

  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect logged-in users away from auth pages
  if (currentPath.startsWith('/auth/') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  let userRole = 'public';
  if (session?.user.id) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      return new NextResponse('Error verifying user role', { status: 500 });
    }

    if (!profile) {
      const isAdminEmail = session.user.email === 'admin@itwala.com';
      const isMetadataAdmin = session.user.user_metadata?.role === 'admin';

      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          role: (isAdminEmail || isMetadataAdmin) ? 'admin' : 'user',
          full_name: session.user.user_metadata?.full_name || 'User',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        return new NextResponse('Error creating user profile', { status: 500 });
      }

      userRole = newProfile.role;
    } else {
      userRole = profile.role;
    }
  }

  // Admin login page — allow access; redirect if already admin
  if (currentPath === '/admin/login') {
    if (session && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return res;
  }

  // Match the most specific protected route
  const matchedRoutes = Object.entries(PROTECTED_ROUTES)
    .filter(([route]) => currentPath.startsWith(route))
    .sort((a, b) => b[0].length - a[0].length);

  const matchedRoute = matchedRoutes[0];

  if (matchedRoute) {
    if (!session) {
      if (currentPath.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      const redirectUrl = new URL('/auth', req.url);
      redirectUrl.searchParams.set('redirectTo', currentPath);
      return NextResponse.redirect(redirectUrl);
    }

    if (!matchedRoute[1].includes(userRole)) {
      return NextResponse.redirect(
        new URL(userRole === 'admin' ? '/admin' : '/dashboard', req.url)
      );
    }
  }

  return res;
}

export const config = {
  // Run on all pages — skip API routes, Next.js internals, and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
};
