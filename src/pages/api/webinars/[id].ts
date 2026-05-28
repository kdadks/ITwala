import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Webinar ID is required' });
  }

  try {
    const { data: webinar, error } = await supabase
      .from('webinars')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error || !webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    const { count, error: countError } = await supabase
      .from('webinar_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('webinar_id', id);

    if (countError) {
      return res.status(500).json({ error: countError.message });
    }

    return res.status(200).json({ webinar: { ...webinar, registration_count: count ?? 0 } });
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
