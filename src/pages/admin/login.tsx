import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface AdminLoginFormData {
  email: string;
  password: string;
}

const AdminLogin: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormData>();

  // Redirect if already logged in as admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        // Check if user is admin
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const isMetadataAdmin = user.user_metadata?.role === 'admin';
        const isProfileAdmin = profile?.role === 'admin';
        const isAdminEmail = user.email === 'admin@itwala.com';

        if (isMetadataAdmin || isProfileAdmin || isAdminEmail) {
          router.push('/admin');
        } else {
          // Not an admin, sign them out
          await supabaseClient.auth.signOut();
          toast.error('This login is for administrators only.');
        }
      }
    };

    checkAdminStatus();
  }, [user, supabaseClient, router]);

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);

    try {
      console.log('Attempting admin login for:', data.email);

      // Clear any existing session conflicts before login
      if (typeof window !== 'undefined') {
        const authKeys = Object.keys(localStorage).filter(key =>
          key.includes('supabase') || key.includes('auth') || key.includes('sb-')
        );
        if (authKeys.length > 1) {
          console.log('Clearing multiple auth tokens before login');
          authKeys.forEach(key => localStorage.removeItem(key));
        }
      }

      // Attempt to sign in
      const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        console.error('Admin login error:', signInError);

        if (signInError.message.toLowerCase().includes('invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials.');
        } else if (signInError.message.toLowerCase().includes('email not confirmed')) {
          toast.error('Please confirm your email before logging in.');
        } else {
          toast.error(signInError.message || 'Failed to log in. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      if (signInData?.user) {
        console.log('Login successful, verifying admin status...');

        // Check if user is admin
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', signInData.user.id)
          .single();

        const isMetadataAdmin = signInData.user.user_metadata?.role === 'admin';
        const isProfileAdmin = profile?.role === 'admin';
        const isAdminEmail = signInData.user.email === 'admin@itwala.com';

        if (!isMetadataAdmin && !isProfileAdmin && !isAdminEmail) {
          // Not an admin, sign them out
          await supabaseClient.auth.signOut();
          toast.error('Access denied. This login is for administrators only.');
          setIsLoading(false);
          return;
        }

        toast.success('Welcome to Admin Panel!');
        router.push('/admin');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred. Please try again.';
      console.error('Admin login error:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - ITwala Academy</title>
        <meta name="description" content="Administrator login for ITwala Academy" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-primary-900 opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-gray-700 opacity-10 blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative z-10"
          style={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(59, 130, 246, 0.15)'
          }}
        >
          {/* Logo and Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 rounded-2xl blur-lg opacity-60"></div>
                <Image
                  src="/images/IT-WALA-logo-64x64.png"
                  alt="ITwala Logo"
                  width={80}
                  height={80}
                  className="relative z-10 rounded-xl shadow-lg"
                  priority
                />
              </div>
            </motion.div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-600">
              ITwala Academy Administrator Login
            </p>
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-200">
              <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold text-red-700">Restricted Access</span>
            </div>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md space-y-4">
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                  placeholder="admin@itwala.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:from-gray-900 hover:via-black hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                style={{
                  boxShadow: isLoading ? 'none' : '0 4px 14px 0 rgba(0, 0, 0, 0.4)'
                }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Sign in to Admin Panel
                  </span>
                )}
              </motion.button>
            </div>

            {/* Back to Site Link */}
            <div className="text-center">
              <a
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                ← Back to Main Site
              </a>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="font-semibold">Security Notice:</strong> This is a restricted area. All login attempts are monitored and logged. Unauthorized access attempts will be reported.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;
