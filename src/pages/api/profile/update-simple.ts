import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabaseClient';

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

    // Create Supabase client for authentication only
    const supabase = createPagesServerClient({ req, res });
    
    // Get the current user session for authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        requiresAuth: true 
      });
    }

    const userId = session.user.id;
    console.log('User authenticated:', userId);

    // Use admin client to bypass RLS for this operation
    if (!supabaseAdmin) {
      throw new Error('Admin client not available');
    }

    // Prepare update data
    const updateData = {
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
      updated_at: new Date().toISOString()
    };

    console.log('Updating profile with admin client for user:', userId);

    // Update profile using admin client (bypasses RLS)
    const { data: updatedProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

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

    console.log('Profile updated successfully:', updatedProfile.id);

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