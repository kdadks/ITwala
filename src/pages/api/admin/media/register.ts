import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseAdmin) return res.status(500).json({ error: 'Storage not configured' });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { storage_path, original_name, mime_type, file_size, media_type } = req.body as {
    storage_path?: unknown;
    original_name?: unknown;
    mime_type?: unknown;
    file_size?: unknown;
    media_type?: unknown;
  };

  if (
    typeof storage_path !== 'string' || !storage_path.trim() ||
    typeof original_name !== 'string' || !original_name.trim() ||
    typeof mime_type !== 'string' || !mime_type.trim() ||
    typeof file_size !== 'number' || file_size <= 0 ||
    typeof media_type !== 'string' || !['image', 'video', 'document'].includes(media_type)
  ) {
    return res.status(400).json({ error: 'Invalid or missing required fields' });
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('media')
    .getPublicUrl(storage_path);

  const { data, error } = await supabaseAdmin
    .from('media_assets')
    .insert({
      storage_path,
      public_url:    urlData.publicUrl,
      type:          media_type,
      original_name,
      mime_type,
      file_size,
      uploaded_by:   admin.id,
    })
    .select()
    .single();

  if (error) {
    console.error('[register] DB error:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ asset: data });
}
