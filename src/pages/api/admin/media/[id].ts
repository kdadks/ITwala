import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabaseAdmin) return res.status(500).json({ error: 'Storage not configured' });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'PATCH') {
    const { alt_text, description, original_name } = req.body as {
      alt_text?: unknown;
      description?: unknown;
      original_name?: unknown;
    };

    const updates: Record<string, string> = {};
    if (typeof alt_text === 'string')     updates.alt_text      = alt_text;
    if (typeof description === 'string')  updates.description   = description;
    if (typeof original_name === 'string' && original_name.trim()) {
      updates.original_name = original_name.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('media_assets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ asset: data });
  }

  if (req.method === 'DELETE') {
    const { data: asset, error: fetchError } = await supabaseAdmin
      .from('media_assets')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError || !asset) return res.status(404).json({ error: 'Asset not found' });

    const { error: storageError } = await supabaseAdmin.storage
      .from('media')
      .remove([asset.storage_path]);

    if (storageError) {
      console.error('[media/delete] Storage error:', storageError);
      return res.status(500).json({ error: storageError.message });
    }

    const { error: dbError } = await supabaseAdmin
      .from('media_assets')
      .delete()
      .eq('id', id);

    if (dbError) return res.status(500).json({ error: dbError.message });

    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', 'PATCH, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
