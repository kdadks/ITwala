import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw sessionError;
    }

    if (!session) {
      return res.status(401).json({ message: 'No session found' });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Get all auth data
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(session.user.id);

    if (authError) {
      throw authError;
    }

    return res.status(200).json({
      session: session,
      profile: profile,
      authData: authData,
      user: session.user
    });

  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    return res.status(500).json({
      message: 'Error checking user status',
      error: error.message
    });
  }
}
