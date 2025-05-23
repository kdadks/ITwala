import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { toast } from 'react-hot-toast';

const Admin: NextPage = () => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      console.log('Checking admin status...');
      
      if (!user) {
        console.log('No user found, will redirect to login');
        setError('No user found');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Checking user:', { id: user.id, email: user.email, metadata: user.user_metadata });
        
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

        console.log('Profile found:', profile);

        // Check for admin status in both metadata and profile
        const isMetadataAdmin = user.user_metadata?.role === 'admin';
        const isProfileAdmin = profile?.role === 'admin';
        const isUserAdmin = isMetadataAdmin || isProfileAdmin;

        console.log('Admin check:', { isMetadataAdmin, isProfileAdmin, isUserAdmin });
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          console.log('User is not admin');
          setError('Access denied: User is not an admin');
        }

        // Get debug info
        const response = await fetch('/api/debug/admin-check');
        const debugData = await response.json();
        console.log('Debug info:', debugData);
        setDebugInfo(debugData);

      } catch (error: any) {
        console.error('Admin check error:', error);
        setError(`Error checking admin status: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user, supabase]);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-2xl p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          {debugInfo && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4 text-left">
              <h3 className="font-bold mb-2">Debug Information:</h3>
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Admin Dashboard - ITwala Academy</title>
        <meta name="description" content="Admin dashboard for ITwala Academy" />
      </Head>

      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
};

export default Admin;