import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';
import CreateProfileForm from '../../components/profile/CreateProfileForm';

const CompleteProfile: NextPage = () => {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Complete Your Profile - ITwala Academy</title>
        <meta name="description" content="Complete your profile to get the full ITwala Academy experience." />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Welcome to ITwala Academy!</h1>
            <p className="mt-2 text-sm text-gray-600">
              Let's complete your profile to get started
            </p>
          </div>
          
          <CreateProfileForm onSuccess={handleSuccess} />
        </div>
      </main>
    </>
  );
};

export default CompleteProfile;