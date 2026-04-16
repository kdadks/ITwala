// Central session management to prevent conflicts
import { supabase } from '@/lib/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns the shared Supabase client.
 * Previously this file created a second client instance, which caused the
 * very session conflicts it was trying to resolve.  Now it delegates to the
 * single canonical client defined in supabaseClient.ts.
 */
export function getSupabaseClient(): SupabaseClient {
  return supabase;
}

// Clear session conflicts
export async function clearSessionConflicts(): Promise<void> {
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
  }
}

// Check for session conflicts
export async function detectSessionConflicts(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check for multiple auth tokens in localStorage
    const authKeys = Object.keys(localStorage).filter(key =>
      key.includes('supabase') || key.includes('auth') || key.includes('sb-')
    );

    if (authKeys.length > 1) {
      return true;
    }

    const { error } = await supabase.auth.getSession();

    if (error) {
      if (error.message.includes('409') || error.message.includes('conflict')) {
        return true;
      }

      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        return true;
      }
    }

    return false;
  } catch (err: unknown) {
    console.error('Error detecting session conflicts:', err);
    // If we can't check, assume there's a conflict to be safe
    return true;
  }
}

// Force session refresh
export async function refreshSession() {
  if (typeof window === 'undefined') return null;
  
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Session refresh error:', error);
      // If refresh fails, clear everything
      await clearSessionConflicts();
      return null;
    }
    
    return data;
  } catch (err: unknown) {
    console.error('Session refresh exception:', err);
    await clearSessionConflicts();
    return null;
  }
}
