import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { getMediaType, ACCEPTED_MIME_TYPES, MEDIA_TYPE_LABELS } from '@/types/media';

function sanitizeFilename(name: string): string {
  const dotIdx = name.lastIndexOf('.');
  const ext = dotIdx >= 0 ? name.slice(dotIdx + 1).toLowerCase() : '';
  const base = (dotIdx >= 0 ? name.slice(0, dotIdx) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
  return `${base || 'file'}-${Date.now()}${ext ? `.${ext}` : ''}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseAdmin) return res.status(500).json({ error: 'Storage not configured' });

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { filename, mime_type, file_size } = req.body as {
    filename?: unknown;
    mime_type?: unknown;
    file_size?: unknown;
  };

  if (typeof filename !== 'string' || !filename.trim()) {
    return res.status(400).json({ error: '`filename` is required' });
  }
  if (typeof mime_type !== 'string' || !mime_type.trim()) {
    return res.status(400).json({ error: '`mime_type` is required' });
  }
  if (typeof file_size !== 'number' || file_size <= 0) {
    return res.status(400).json({ error: '`file_size` must be a positive number' });
  }

  const mediaType = getMediaType(mime_type);
  if (!mediaType) {
    const allowed = Object.values(ACCEPTED_MIME_TYPES).flat().join(', ');
    return res.status(400).json({ error: `Unsupported file type "${mime_type}". Allowed: ${allowed}` });
  }

  const maxBytes = MEDIA_TYPE_LABELS[mediaType].maxMB * 1024 * 1024;
  if (file_size > maxBytes) {
    return res.status(400).json({
      error: `File too large. Max size for ${mediaType}s is ${MEDIA_TYPE_LABELS[mediaType].maxMB} MB`,
    });
  }

  const safeName = sanitizeFilename(filename);
  const storagePath = `${mediaType}s/${safeName}`;

  const { data, error } = await supabaseAdmin.storage
    .from('media')
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    console.error('[prepare-upload] Supabase error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to create upload URL' });
  }

  return res.status(200).json({
    signed_url:   data.signedUrl,
    path:         data.path,
    token:        data.token,
    storage_path: storagePath,
    media_type:   mediaType,
  });
}
