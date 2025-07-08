import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/layout/Layout';
import AnalyticsTracker from '../components/common/AnalyticsTracker';

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  useEffect(() => {
    console.log('Supabase client initialized');
  }, []);

  return (
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
  );
}