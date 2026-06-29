import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseAdmin) return res.status(500).json({ error: 'Storage not configured' });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { type, search, page = '1', limit = '50' } = req.query;
  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
  const offset = (pageNum - 1) * limitNum;

  let query = supabaseAdmin
    .from('media_assets')
    .select('*', { count: 'exact' });

  if (type && ['image', 'video', 'document'].includes(type as string)) {
    query = query.eq('type', type);
  }

  if (typeof search === 'string' && search.trim()) {
    query = query.ilike('original_name', `%${search.trim()}%`);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limitNum - 1);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ assets: data ?? [], total: count ?? 0 });
}
