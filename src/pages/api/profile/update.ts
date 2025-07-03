import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { profileData } = req.body;

    console.log('Profile update request received:', {
      hasProfileData: !!profileData,
      profileDataKeys: profileData ? Object.keys(profileData) : null
    });

    if (!profileData) {
      return res.status(400).json({ message: 'Profile data is required' });
    }

    // Create Supabase client for the request
    const supabase = createPagesServerClient({ req, res });
    
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Authentication check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      sessionError: sessionError?.message,
      userEmail: session?.user?.email
    });
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return res.status(401).json({
        message: 'Session error: ' + sessionError.message,
        requiresAuth: true,
        debug: { sessionError: sessionError.message }
      });
    }
    
    if (!session?.user) {
      console.error('No user in session');
      return res.status(401).json({
        message: 'No authenticated user found',
        requiresAuth: true,
        debug: { hasSession: !!session, sessionKeys: session ? Object.keys(session) : null }
      });
    }

    const userId = session.user.id;
    console.log('Authenticated user ID:', userId);

    // Prepare update data
    const updateData = {
      id: userId,
      full_name: profileData.fullName,
      phone: profileData.phone,
      bio: profileData.bio,
      address_line1: profileData.addressLine1,
      address_line2: profileData.addressLine2,
      city: profileData.city,
      state: profileData.state,
      country: profileData.country,
      pincode: profileData.pincode,
      highest_qualification: profileData.highestQualification,
      degree_name: profileData.degreeName,
      has_laptop: profileData.hasLaptop,
      email: session.user.email,
      updated_at: new Date().toISOString()
    };

    console.log('Attempting profile update with data:', updateData);

    // Update profile in database
    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .upsert(updateData)
      .select()
      .single();

    console.log('Database operation result:', {
      success: !profileError,
      hasData: !!updatedProfile,
      error: profileError ? {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint
      } : null
    });

    if (profileError) {
      console.error('Profile update error:', profileError);
      return res.status(500).json({
        message: 'Failed to update profile',
        error: profileError.message,
        debug: {
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
          userId: userId
        }
      });
    }

    // Try to update auth metadata (this is optional and may not work in all setups)
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: profileData.fullName,
        },
      });
    } catch (authError) {
      console.log('Auth metadata update skipped:', authError);
      // This is not critical, so we don't fail the request
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    return res.status(500).json({
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}