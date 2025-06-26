import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Course slug is required' });
  }

  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select('reviews')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Course not found' });
      }
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }

    res.status(200).json({ reviews: course.reviews || [] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
