import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { requireAdmin } from '@/lib/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Admin client not configured' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Webinar ID is required' });
  }

  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const page = Math.max(1, parseInt(typeof req.query.page === 'string' ? req.query.page : '1', 10));
  const limit = Math.min(200, Math.max(1, parseInt(typeof req.query.limit === 'string' ? req.query.limit : '50', 10)));
  const offset = (page - 1) * limit;

  try {
    // Verify webinar exists
    const { error: webinarError } = await supabaseAdmin
      .from('webinars')
      .select('id')
      .eq('id', id)
      .single();

    if (webinarError) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    let query = supabaseAdmin
      .from('webinar_registrations')
      .select('*', { count: 'exact' })
      .eq('webinar_id', id)
      .order('registered_at', { ascending: false });

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      registrants: data ?? [],
      total: count ?? 0,
      page,
      limit,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
