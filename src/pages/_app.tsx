import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
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

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [sessionConflictResolved, setSessionConflictResolved] = useState(false);

  useEffect(() => {
    console.log('Supabase client initialized');
    
    // Check for and clear session conflicts on app start
    const handleSessionConflicts = async () => {
      try {
        const hasConflict = await detectSessionConflicts();
        if (hasConflict) {
          console.log('Session conflict detected, clearing...');
          await clearSessionConflicts();
          setSessionConflictResolved(true);
          
          // Small delay to ensure storage is cleared
          setTimeout(() => {
            console.log('Session conflicts cleared, ready to continue');
          }, 100);
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
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        
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