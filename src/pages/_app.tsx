import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import AnalyticsTracker from '../components/common/AnalyticsTracker';
import { AuthErrorBoundary } from '../components/common/AuthErrorBoundary';
import { Inter } from 'next/font/google';
import { detectSessionConflicts, clearSessionConflicts } from '../lib/sessionManager';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter',
});

export default function App({ Component, pageProps, router }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [sessionConflictResolved, setSessionConflictResolved] = useState(false);

  // Check if current route is an admin route
  const isAdminRoute = router.pathname.startsWith('/admin');
  const isAdminLoginRoute = router.pathname === '/admin/login';

  useEffect(() => {
    // Check for and clear session conflicts on app start
    const handleSessionConflicts = async () => {
      try {
        const hasConflict = await detectSessionConflicts();
        if (hasConflict) {
          await clearSessionConflicts();
          setSessionConflictResolved(true);
        } else {
          setSessionConflictResolved(true);
        }
      } catch (error) {
        console.error('Error handling session conflicts:', error);
        // If there's an error, clear everything to be safe
        await clearSessionConflicts();
        setSessionConflictResolved(true);
      }
    };

    handleSessionConflicts();

    // Listen for auth state changes and handle conflicts
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Clear any remaining session data
          await clearSessionConflicts();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseClient]);

  // Don't render the app until session conflicts are resolved
  if (!sessionConflictResolved) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Initializing session...</p>
        </div>
      </div>
    );
  }

  // Render admin app separately
  if (isAdminRoute) {
    // Admin login page - render without AdminLayout
    if (isAdminLoginRoute) {
      return (
        <div className={`${inter.variable} ${inter.className}`}>
          <AuthErrorBoundary>
            <SessionContextProvider
              supabaseClient={supabaseClient}
              initialSession={pageProps.initialSession}
            >
              <Component {...pageProps} />
              <Toaster position="top-right" />
            </SessionContextProvider>
          </AuthErrorBoundary>
        </div>
      );
    }

    // Other admin pages - render with AdminLayout
    return (
      <div className={`${inter.variable} ${inter.className}`}>
        <AuthErrorBoundary>
          <SessionContextProvider
            supabaseClient={supabaseClient}
            initialSession={pageProps.initialSession}
          >
            <AdminLayout>
              <Component {...pageProps} />
              <Toaster position="top-right" />
            </AdminLayout>
          </SessionContextProvider>
        </AuthErrorBoundary>
      </div>
    );
  }

  // Render public app
  return (
    <div className={`${inter.variable} ${inter.className}`}>
      <AuthErrorBoundary>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <Layout>
            <AnalyticsTracker />
            <Component {...pageProps} />
            <Toaster position="top-right" />
          </Layout>
        </SessionContextProvider>
      </AuthErrorBoundary>
    </div>
  );
}