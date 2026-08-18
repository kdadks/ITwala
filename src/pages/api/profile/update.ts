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

    if (!profileData) {
      return res.status(400).json({ message: 'Profile data is required' });
    }

    // Create Supabase client for the request
    const supabase = createPagesServerClient({ req, res });
    
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return res.status(401).json({
        message: 'Session error',
        requiresAuth: true
      });
    }
    
    if (!session?.user) {
      return res.status(401).json({
        message: 'No authenticated user found',
        requiresAuth: true
      });
    }

    const userId = session.user.id;

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

    // Update profile in database
    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .upsert(updateData)
      .select()
      .single();

    if (profileError) {
      return res.status(500).json({
        message: 'Failed to update profile'
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
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });

  } catch (error: any) {
    const isDev = process.env.NODE_ENV === 'development';
    return res.status(500).json({
      message: 'Failed to update profile',
      ...(isDev && { error: error.message })
    });
  }
}