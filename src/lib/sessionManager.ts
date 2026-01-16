// Central session management to prevent conflicts
import { createClient } from '@supabase/supabase-js';

// Singleton pattern to ensure only one client instance
let clientInstance: any = null;

export function getSupabaseClient() {
  if (!clientInstance && typeof window !== 'undefined') {
    clientInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: window.localStorage,
          storageKey: 'supabase.auth.token'
        }
      }
    );
  }
  return clientInstance;
}

// Clear session conflicts
export async function clearSessionConflicts() {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    const keysToRemove = [
      'supabase.auth.token',
      'supabase-auth-token',
      'sb-auth-token',
      'auth.token',
      'sb-lyywvmoxtlovvxknpkpw-auth-token'
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

    // Clear sessionStorage as well
    sessionStorage.clear();

    // Reset client instance
    clientInstance = null;
  }
}

// Check for session conflicts
export async function detectSessionConflicts() {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check for multiple auth tokens in localStorage
    const authKeys = Object.keys(localStorage).filter(key =>
      key.includes('supabase') || key.includes('auth') || key.includes('sb-')
    );

    if (authKeys.length > 1) {
      return true;
    }

    const client = getSupabaseClient();
    if (!client) return false;

    const { data: { session }, error } = await client.auth.getSession();

    if (error) {
      if (error.message.includes('409') || error.message.includes('conflict')) {
        return true;
      }

      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        return true;
      }
    }

    return false;
  } catch (error: any) {
    console.error('Error detecting session conflicts:', error);
    // If we can't check, assume there's a conflict to be safe
    return true;
  }
}

// Force session refresh
export async function refreshSession() {
  if (typeof window === 'undefined') return null;
  
  const client = getSupabaseClient();
  if (!client) return null;
  
  try {
    const { data, error } = await client.auth.refreshSession();
    
    if (error) {
      console.error('Session refresh error:', error);
      // If refresh fails, clear everything
      await clearSessionConflicts();
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Session refresh exception:', error);
    await clearSessionConflicts();
    return null;
  }
}
