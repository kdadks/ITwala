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
      // If we can't verify the role, deny access to protected routes
      return new NextResponse('Error verifying user role', { status: 500 });
    }

    if (!profile) {
      console.log('No profile found, creating new profile...');
      const isAdminEmail = session.user.email === 'admin@itwala.com';
      const isMetadataAdmin = session.user.user_metadata?.role === 'admin';
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          role: (isAdminEmail || isMetadataAdmin) ? 'admin' : 'user',
          full_name: session.user.user_metadata?.full_name || 'User',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return new NextResponse('Error creating user profile', { status: 500 });
      }

      userRole = newProfile.role;
    } else {
      userRole = profile.role;
    }
    
    console.log('User role:', userRole);
  }

  // Allow access to admin login page
  if (req.nextUrl.pathname === '/admin/login') {
    // If already logged in as admin, redirect to admin dashboard
    if (session && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    // Otherwise, allow access to login page
    return res;
  }

  // Define protected routes and their allowed roles
  // Admin should not access student portal, students should not access admin
  const protectedRoutes = {
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

  // Get the most specific matching route
  const currentPath = req.nextUrl.pathname;
  const matchedRoutes = Object.entries(protectedRoutes)
    .filter(([route]) => currentPath.startsWith(route))
    .sort((a, b) => b[0].length - a[0].length); // Sort by route length, longest first
  
  const matchedRoute = matchedRoutes[0]; // Get the most specific match

  console.log('Matched route:', matchedRoute?.[0]);

  if (matchedRoute) {
    console.log('Checking access for route:', matchedRoute[0]);
    console.log('Required roles:', matchedRoute[1]);
    console.log('Current user role:', userRole);

    // If user is not logged in, redirect based on route type
    if (!session) {
      console.log('No session found, redirecting...');

      // Admin routes go to admin login
      if (currentPath.startsWith('/admin')) {
        const redirectUrl = new URL('/admin/login', req.url);
        return NextResponse.redirect(redirectUrl);
      }

      // Other protected routes go to public auth
      const redirectUrl = new URL('/auth', req.url);
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If user's role is not allowed, redirect appropriately
    if (!matchedRoute[1].includes(userRole)) {
      console.log('Access denied: User role not allowed');
      // Admin users go to admin panel, others go to dashboard
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/auth/:path*'],
};
