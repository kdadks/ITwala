import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { fileTypeFromBuffer } from 'file-type';
import { uploadImageSchema } from '@/utils/validation';
import { applyRateLimit } from '@/lib/rateLimit';

// Allow up to 10MB body for base64-encoded images (5MB file ≈ 6.7MB base64)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Admin client not available' });
  }

  try {
    const validated = uploadImageSchema.parse(req.body);
    const { courseId, base64, contentType, filename } = validated;

    if (!applyRateLimit(req, res)) return;

    // Strip the data URI prefix (data:image/jpeg;base64,...)
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    const buffer = Buffer.from(base64Data, 'base64');

    // Validate actual file type using magic bytes
    const fileType = await fileTypeFromBuffer(buffer);
    if (!fileType || !fileType.mime.startsWith('image/')) {
      return res.status(400).json({ error: 'Invalid image file' });
    }

    if (fileType.mime !== contentType) {
      return res.status(400).json({ error: 'File type mismatch' });
    }

    const ext = filename?.split('.').pop() || contentType.split('/')[1] || 'jpg';
    const storagePath = `${courseId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('course-images')
      .upload(storagePath, buffer, { contentType, upsert: true });

    if (uploadError) {
      return res.status(500).json({ error: 'Upload failed' });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('course-images')
      .getPublicUrl(storagePath);

    return res.status(200).json({ url: publicUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Upload failed' });
  }
}
