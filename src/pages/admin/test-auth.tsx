import { NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';

const TestAuth: NextPage = () => {
  const { user, isAdmin, isLoading, profile, debugInfo } = useAuth();
  const supabase = useSupabaseClient();
  const [categoriesTest, setCategoriesTest] = useState<any>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isAdmin) {
      testCategoriesAccess();
    }
  }, [user, isAdmin]);

  const testCategoriesAccess = async () => {
    try {
      console.log('Testing categories access...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(5);

      if (error) {
        console.error('Categories error:', error);
        setCategoriesError(error.message);
      } else {
        console.log('Categories success:', data);
        setCategoriesTest(data);
      }
    } catch (error: any) {
      console.error('Categories test error:', error);
      setCategoriesError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>Auth Test - Admin</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
            <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
            <p><strong>Is Admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Auth Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          {profile ? (
            <div className="space-y-2">
              <p><strong>Profile ID:</strong> {profile.id}</p>
              <p><strong>Full Name:</strong> {profile.full_name}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <p><strong>Created:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-gray-500">No profile data</p>
          )}
        </div>

        {/* Categories Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Categories Access Test</h2>
          {categoriesError ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-600"><strong>Error:</strong> {categoriesError}</p>
            </div>
          ) : categoriesTest ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="text-green-600 mb-2"><strong>Success!</strong> Categories loaded:</p>
              <ul className="list-disc list-inside space-y-1">
                {categoriesTest.map((cat: any) => (
                  <li key={cat.id} className="text-gray-700">{cat.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">No categories test run yet</p>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          {debugInfo ? (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">No debug info available</p>
          )}
        </div>

        {/* User Metadata */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Metadata</h2>
          {user?.user_metadata ? (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(user.user_metadata, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500">No user metadata available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestAuth;