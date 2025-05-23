import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return res.status(500).json({ 
      error: 'Missing environment variables',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing'
    });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    // 1. Get current session state
    console.log('Checking session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!session?.user) {
      console.log('No active session found');
      return res.status(401).json({
        error: 'No active session',
        message: 'Please log in first'
      });
    }

    console.log('Session found:', {
      id: session.user.id,
      email: session.user.email,
      metadata: session.user.user_metadata
    });

    // 2. Check profile table for current user
    console.log('Checking profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error(`Profile error: ${profileError.message}`);
    }

    // 3. If no profile exists, try to create it
    let fixResult = null;
    if (!profile) {
      console.log('No profile found, creating new profile...');
      const { data: fixedProfile, error: fixError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          role: session.user.email === 'admin@itwala.com' ? 'admin' : 'user',
          full_name: session.user.user_metadata?.full_name || 'User',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (fixError) {
        console.error('Profile fix error:', fixError);
        throw new Error(`Profile fix error: ${fixError.message}`);
      }
      console.log('Created new profile:', fixedProfile);
      fixResult = fixedProfile;
    } else {
      console.log('Existing profile found:', profile);
    }

    // Return all debug information
    const response = {
      currentSession: {
        user: {
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        }
      },
      existingProfile: profile,
      fixedProfile: fixResult,
      currentUrl: req.url,
      timestamp: new Date().toISOString()
    };

    console.log('Returning response:', response);
    return res.status(200).json(response);

  } catch (error: any) {
    console.error('Admin debug error:', error);
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
