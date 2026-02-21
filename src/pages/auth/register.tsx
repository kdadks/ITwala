import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Legacy route - redirects to /auth
 * This page exists for backward compatibility with old links
 */
export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new combined auth page
    router.replace('/auth');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to sign up...</p>
      </div>
    </div>
  );
}
