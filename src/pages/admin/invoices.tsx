import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InvoiceGenerator from '@/components/admin/InvoiceGenerator';
import { toast } from 'react-hot-toast';

const AdminInvoices: NextPage = () => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && !profileError.message.includes('Results contain 0 rows')) {
          console.error('Profile error:', profileError);
          throw profileError;
        }

        const isMetadataAdmin = user.user_metadata?.role === 'admin';
        const isProfileAdmin = profile?.role === 'admin';
        const isUserAdmin = isMetadataAdmin || isProfileAdmin;

        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          toast.error('Access denied: Admin privileges required');
          router.push('/dashboard');
        }
      } catch (error: any) {
        console.error('Admin check error:', error);
        toast.error(`Error checking admin status: ${error.message}`);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [user, supabase, router]);

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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Invoice Generator - ITwala Academy Admin</title>
        <meta name="description" content="Generate and manage invoices for ITwala Academy" />
      </Head>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Generator</h1>
            <p className="text-gray-600">Create professional invoices for course enrollments and payments</p>
          </div>

          <InvoiceGenerator />
        </motion.div>
      </main>
    </>
  );
};

// Disable static generation for this admin page
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default AdminInvoices;
