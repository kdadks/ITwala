import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('webinars')
      .select(
        'id, title, slug, description, date_time, duration_minutes, speaker_name, speaker_title, speaker_image, banner_image, status, registration_limit, topics'
      )
      .eq('status', 'published')
      .order('date_time', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ webinars: data ?? [] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
