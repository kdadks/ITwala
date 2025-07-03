import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, full_name, avatar_url } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if supabaseAdmin is available
    if (!supabaseAdmin) {
      console.error('Supabase admin client not available');
      return res.status(500).json({ error: 'Admin client not configured' });
    }

    // Use the admin function to create profile
    const { data, error } = await supabaseAdmin.rpc('admin_create_profile', {
      p_user_id: user_id,
      p_full_name: full_name || '',
      p_avatar_url: avatar_url || ''
    });

    if (error) {
      console.error('Error calling admin_create_profile:', error);
      return res.status(500).json({
        error: 'Failed to create profile via admin function',
        details: error.message
      });
    }

    return res.status(200).json({
      message: 'Profile created successfully',
      result: data
    });

  } catch (error) {
    console.error('Unexpected error in create-profile:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}