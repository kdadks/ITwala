import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import GlossyNavbar from './GlossyNavbar';
import Footer from './Footer';
import WhatsAppButton from '../common/WhatsAppButton';
import CookieConsent from '../common/CookieConsent';
import { useAuth } from '@/hooks/useAuth';
import { trackPageView, initializeAnalytics } from '@/utils/analytics';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { user, isAdmin, isLoading, hasPermission } = useAuth();

  // Check route types
  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  const isAuthRoute = router.pathname.startsWith('/auth');

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Track page views on route change
  useEffect(() => {
    // Don't track auth routes
    if (isAuthRoute) return;

    // Track the page view
    trackPageView(supabase);
  }, [router.pathname, isAuthRoute, supabase]);

  // Show loading state while checking auth for protected routes
  if (isLoading && isDashboardRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700">
      {/* Abstract shapes background - matching hero section */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-primary-900 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-secondary-800 opacity-10 blur-3xl"></div>
      </div>

      {!isAuthRoute && <GlossyNavbar />}
      <div className={`flex-grow ${isAuthRoute ? '' : 'pt-32'} relative z-10`}>{children}</div>
      {/* Move WhatsAppButton slightly higher to avoid scroll error overlap */}
      <WhatsAppButton positionClass="fixed bottom-20 right-4 sm:bottom-24 sm:right-6" />
      {!isAuthRoute && !isDashboardRoute && <Footer />}

      {/* Cookie Consent Banner - Show on all public pages */}
      {!isAuthRoute && <CookieConsent />}
    </div>
  );
};

export default Layout;