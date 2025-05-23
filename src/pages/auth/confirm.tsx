import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ConfirmEmail() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const { error } = await supabaseClient.auth.verifyOtp({
          token_hash: router.query.token_hash as string,
          type: 'email'
        });

        if (error) {
          throw error;
        }

        setIsConfirmed(true);
        toast.success('Email confirmed successfully!');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } catch (error: any) {
        toast.error(error.message || 'Failed to confirm email');
        console.error('Email confirmation error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only run confirmation if we have a token
    if (router.query.token_hash) {
      confirmEmail();
    } else {
      setIsLoading(false);
    }
  }, [router.query.token_hash, supabaseClient.auth, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center"
      >
        {isConfirmed ? (
          <>
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Email Confirmed!</h2>
            <p className="mt-2 text-gray-600">
              Your email has been confirmed. Redirecting you to login...
            </p>
          </>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Invalid Confirmation Link</h2>
            <p className="mt-2 text-gray-600">
              The email confirmation link is invalid or has expired. Please try logging in again to receive a new confirmation email.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Return to Login
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
