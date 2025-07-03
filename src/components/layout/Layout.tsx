import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../common/WhatsAppButton';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAdmin, isLoading, hasPermission } = useAuth();
  
  // Check route types
  const isAdminRoute = router.pathname.startsWith('/admin');
  const isDashboardRoute = router.pathname.startsWith('/dashboard');
  const isAuthRoute = router.pathname.startsWith('/auth');

  // Show loading state while checking auth
  if (isLoading && (isAdminRoute || isDashboardRoute)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Show access denied for unauthorized users trying to access admin routes
  if (isAdminRoute && user && !hasPermission(['admin'])) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // If on admin route and authorized, render without Navbar and Footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {!isAuthRoute && <Navbar />}
      <div className={`flex-grow ${isAuthRoute ? '' : 'pt-16'}`}>{children}</div>
      {/* Move WhatsAppButton slightly higher to avoid scroll error overlap */}
      <WhatsAppButton positionClass="fixed bottom-20 right-4 sm:bottom-24 sm:right-6" />
      {!isAuthRoute && !isDashboardRoute && <Footer />}
    </div>
  );
};

export default Layout;