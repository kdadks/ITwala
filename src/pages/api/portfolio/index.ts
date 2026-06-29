import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  try {
    if (req.method === 'GET') {
      // Get all active portfolio items for public viewing
      const { data, error } = await supabase
        .from('public_portfolio')
        .select('*');

      if (error) throw error;
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.warn('Public portfolio API error:', error.message);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
