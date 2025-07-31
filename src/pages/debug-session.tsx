import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser, useSession } from '@supabase/auth-helpers-react';

export default function SessionDebugPage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const session = useSession();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError(`Session Error: ${sessionError.message}`);
          return;
        }
        
        setSessionInfo({
          sessionExists: !!currentSession,
          userExists: !!user,
          sessionFromContext: !!session,
          userId: user?.id,
          userEmail: user?.email,
          sessionId: currentSession?.access_token?.substring(0, 20) + '...',
          lastError: null
        });
        setError(null);
      } catch (err: any) {
        setError(`Unexpected Error: ${err.message}`);
        console.error('Session check error:', err);
      }
    };

    checkSession();
  }, [supabase, user, session]);

  const testSignIn = async () => {
    try {
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@itwala.com',
        password: 'Admin@123'
      });
      
      if (signInError) {
        setError(`Sign In Error: ${signInError.message}`);
      } else {
        console.log('Sign in successful:', data);
      }
    } catch (err: any) {
      setError(`Sign In Exception: ${err.message}`);
    }
  };

  const testSignOut = async () => {
    try {
      setError(null);
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        setError(`Sign Out Error: ${signOutError.message}`);
      } else {
        console.log('Sign out successful');
      }
    } catch (err: any) {
      setError(`Sign Out Exception: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Session Debug Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">Session Information</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(sessionInfo, null, 2)}
        </pre>
      </div>
      
      <div className="space-x-4">
        <button
          onClick={testSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Sign In
        </button>
        
        <button
          onClick={testSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Test Sign Out
        </button>
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <p>This page helps debug session management issues.</p>
        <p>If you see 409 errors, it indicates session conflicts that need to be resolved.</p>
      </div>
    </div>
  );
}
