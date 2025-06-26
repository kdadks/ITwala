import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;
  const supabase = createServerSupabaseClient({ req, res });

  try {
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // Get the course to update
    const { data: existingCourse, error: fetchError } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', slug)
      .single();

    if (fetchError || !existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update the course
    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', existingCourse.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ 
      message: 'Course updated successfully',
      course: data 
    });

  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}