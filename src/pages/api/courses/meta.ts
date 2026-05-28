import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('courses')
      .select('category, level')
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching course meta:', error);
      return res.status(500).json({ error: 'Failed to fetch course metadata' });
    }

    const categories = Array.from(
      new Set((data || []).map(c => c.category))
    ).filter(Boolean).sort() as string[];

    const levels = Array.from(
      new Set(
        (data || []).flatMap(c =>
          c.level ? c.level.split(' to ').map((l: string) => l.trim()) : []
        )
      )
    ).filter(Boolean).sort() as string[];

    // Long cache — categories/levels change rarely
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json({ categories, levels });

  } catch (error) {
    console.error('Meta API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
