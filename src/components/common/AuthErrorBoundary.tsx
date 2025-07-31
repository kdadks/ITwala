import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
    
    // Check if it's a session conflict error
    if (error.message.includes('409') || 
        error.message.includes('conflict') ||
        error.message.includes('session')) {
      console.warn('Session conflict detected in error boundary');
      
      // Clear session conflicts
      if (typeof window !== 'undefined') {
        const keysToRemove = [
          'supabase.auth.token',
          'supabase-auth-token',
          'sb-auth-token',
          'auth.token'
        ];
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
        
        // Clear any other auth-related items
        Object.keys(localStorage).forEach(key => {
          if (key.includes('supabase') || key.includes('auth') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
        
        sessionStorage.clear();
        
        // Reload page after clearing
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800">
                  Authentication Error
                </h3>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <p>There was an issue with the authentication system. This usually happens due to session conflicts.</p>
              {this.state.error?.message.includes('409') && (
                <p className="mt-2 text-orange-600">
                  <strong>Session Conflict Detected:</strong> Clearing conflicting session data...
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  // Clear everything and reload
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                className="bg-gray-600 text-white px-4 py-2 text-sm rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear All & Reload
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4">
                <summary className="text-xs text-gray-500 cursor-pointer">Technical Details</summary>
                <pre className="mt-2 text-xs text-gray-400 bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
