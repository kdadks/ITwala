import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseClient';

// Base64 adds ~33% overhead; allow up to ~7 MB of body for a 5 MB image.
export const config = {
  api: { bodyParser: { sizeLimit: '7mb' } },
};

const BUCKET = 'webinar-images';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function sanitizeFilename(name: string, ext: string): string {
  const withoutExt = name.replace(/\.[^.]+$/, '');
  const slug = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
  const timestamp = Date.now();
  return `${slug || 'image'}-${timestamp}.${ext}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Storage not configured' });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const { name, data, type } = req.body as {
    name?: unknown;
    data?: unknown;
    type?: unknown;
  };

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof data !== 'string' || !data.trim() ||
    typeof type !== 'string' || !type.trim()
  ) {
    return res.status(400).json({ error: '`name`, `data`, and `type` are required strings' });
  }

  const ext = ALLOWED_TYPES[type];
  if (!ext) {
    return res.status(400).json({
      error: `Unsupported image type. Allowed: ${Object.keys(ALLOWED_TYPES).join(', ')}`,
    });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(data, 'base64');
  } catch {
    return res.status(400).json({ error: 'Invalid base64 data' });
  }

  if (buffer.byteLength > MAX_SIZE_BYTES) {
    return res.status(400).json({ error: 'File exceeds maximum size of 5 MB' });
  }

  const filename = sanitizeFilename(name, ext);

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType: type, upsert: false });

  if (uploadError) {
    console.error('[upload] Supabase Storage error:', uploadError);
    return res.status(500).json({ error: uploadError.message || 'Failed to upload file' });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(filename);

  return res.status(200).json({ path: publicUrlData.publicUrl });
}
