import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import AdminHeader from '../admin/AdminHeader';
import AdminSidebar from '../admin/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setError('No user found');
        setIsLoading(false);
        return;
      }

      try {
        // Check profile in Supabase
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && !profileError.message.includes('Results contain 0 rows')) {
          console.error('Profile error:', profileError);
          setError(`Profile error: ${profileError.message}`);
          throw profileError;
        }

        // Check for admin status in both metadata and profile
        const isMetadataAdmin = user.user_metadata?.role === 'admin';
        const isProfileAdmin = profile?.role === 'admin';
        const isAdminEmail = user.email === 'admin@itwala.com';
        const isUserAdmin = isMetadataAdmin || isProfileAdmin || isAdminEmail;

        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          setError('Access denied: User is not an admin');
        }
      } catch (error: any) {
        console.error('Admin check error:', error);
        setError(`Error checking admin status: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user, supabase]);

  // Redirect to admin login if no user
  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Access denied state
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You do not have permission to access the admin panel.</p>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Admin layout
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
