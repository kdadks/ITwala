import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';

/**
 * Verifies that the request carries a valid Supabase session token belonging to
 * a user with role === 'admin' in the profiles table.
 *
 * Returns the authenticated user object on success, or sends an error response
 * and returns null on failure. Callers must return immediately when null is returned.
 */
export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ id: string } | null> {
  if (!supabaseAdmin) {
    res.status(500).json({ error: 'Admin client not configured' });
    return null;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return null;
  }

  const token = authHeader.slice(7);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    res.status(403).json({ error: 'Could not verify admin status' });
    return null;
  }

  if (profile.role !== 'admin') {
    res.status(403).json({ error: 'Access denied: admin role required' });
    return null;
  }

  return { id: user.id };
}
