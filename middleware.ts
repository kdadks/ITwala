import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  console.log('Middleware executing for path:', req.nextUrl.pathname);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('Session found:', !!session);
  
  // For auth routes, redirect logged-in users to dashboard
  if (req.nextUrl.pathname.startsWith('/auth/') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Get user role from profiles table if user is logged in
  let userRole = 'public';
  if (session?.user.id) {
    console.log('Fetching user profile for ID:', session.user.id);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    console.log('Profile found:', profile);
    userRole = profile?.role || 'user';
    console.log('User role:', userRole);
  }

  // Define protected routes and their allowed roles
  const protectedRoutes = {
    '/admin': ['admin'],
    '/admin/courses': ['admin'],
    '/admin/students': ['admin'],
    '/admin/content': ['admin'],
    '/admin/revenue': ['admin'],
    '/admin/instructors': ['admin'],
    '/dashboard': ['admin', 'instructor', 'user'],
    '/dashboard/settings': ['admin', 'instructor', 'user'],
    '/dashboard/courses': ['admin', 'instructor', 'user'],
    '/dashboard/payments': ['admin', 'user'],
    '/dashboard/profile': ['admin', 'instructor', 'user'],
  };

  // Check if the current route is protected
  const matchedRoute = Object.entries(protectedRoutes).find(([route]) => 
    req.nextUrl.pathname.startsWith(route)
  );

  console.log('Matched route:', matchedRoute?.[0]);

  if (matchedRoute) {
    console.log('Checking access for route:', matchedRoute[0]);
    console.log('Required roles:', matchedRoute[1]);
    console.log('Current user role:', userRole);

    // If user is not logged in, redirect to login with return URL
    if (!session) {
      console.log('No session found, redirecting to login');
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If user's role is not allowed, redirect appropriately
    if (!matchedRoute[1].includes(userRole)) {
      console.log('Access denied: User role not allowed');
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/auth/:path*'],
};
