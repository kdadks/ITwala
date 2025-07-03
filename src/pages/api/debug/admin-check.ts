import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      error: 'Missing environment variables',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing',
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing'
    });
  }

  // Use service role key for admin operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Get the Authorization header from the request
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'No auth token provided',
        message: 'Please include Authorization header with Bearer token'
      });
    }

    // Verify the token and get user info
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please log in again'
      });
    }

    console.log('User from token:', {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata
    });

    // Check profile table for current user
    console.log('Checking profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile error:', profileError);
      return res.status(500).json({
        error: `Profile error: ${profileError.message}`
      });
    }

    // If no profile exists, try to create it
    let currentProfile = profile;
    if (!currentProfile) {
      console.log('No profile found, creating new profile...');
      const isAdminEmail = user.email === 'admin@itwala.com';
      const isMetadataAdmin = user.user_metadata?.role === 'admin';
      
      const { data: fixedProfile, error: fixError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          role: (isAdminEmail || isMetadataAdmin) ? 'admin' : 'student',
          full_name: user.user_metadata?.full_name || user.email || 'User',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (fixError) {
        console.error('Profile fix error:', fixError);
        return res.status(500).json({
          error: `Profile fix error: ${fixError.message}`
        });
      }
      console.log('Created new profile:', fixedProfile);
      currentProfile = fixedProfile;
    }

    // Check admin status
    const isMetadataAdmin = user.user_metadata?.role === 'admin';
    const isProfileAdmin = currentProfile?.role === 'admin';
    const isAdminEmail = user.email === 'admin@itwala.com';
    const isAdmin = isMetadataAdmin || isProfileAdmin || isAdminEmail;

    // Return all debug information
    const response = {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      },
      profile: currentProfile,
      adminChecks: {
        isMetadataAdmin,
        isProfileAdmin,
        isAdminEmail,
        isAdmin
      },
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
