import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import AnalyticsTracker from '../components/common/AnalyticsTracker';
import { Inter } from 'next/font/google';

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

  useEffect(() => {
    console.log('Supabase client initialized');
  }, []);

  return (
    <div className={`${inter.variable} ${inter.className}`}>
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
    </div>
  );
}