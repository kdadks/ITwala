import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return res.status(400).json({ error: sessionError.message });
    }

    if (!session) {
      return res.status(401).json({ error: 'No active session' });
    }

    // Refresh the session
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      return res.status(400).json({ error: refreshError.message });
    }

    // Get updated profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    return res.status(200).json({
      message: 'Session refreshed successfully',
      user: refreshData.user,
      profile: profile,
      isAdmin: profile.role === 'admin'
    });

  } catch (error: any) {
    console.error('Session refresh error:', error);
    return res.status(500).json({ error: error.message });
  }
}