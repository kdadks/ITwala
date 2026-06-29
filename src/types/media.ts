export interface MediaAsset {
  id: string;
  storage_path: string;
  public_url: string;
  type: 'image' | 'video' | 'document';
  original_name: string;
  alt_text: string;
  description: string;
  mime_type: string;
  file_size: number;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export type MediaType = 'image' | 'video' | 'document';

export const ACCEPTED_MIME_TYPES: Record<MediaType, string[]> = {
  image:    ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video:    ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  document: ['application/pdf', 'application/msword',
             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
             'text/plain'],
};

export const MEDIA_TYPE_LABELS: Record<MediaType, { extensions: string; maxMB: number }> = {
  image:    { extensions: 'JPG, PNG, WEBP, GIF', maxMB: 10 },
  video:    { extensions: 'MP4, WEBM, MOV',       maxMB: 200 },
  document: { extensions: 'PDF, DOC, DOCX, TXT',  maxMB: 10 },
};

export function getMediaType(mimeType: string): MediaType | null {
  for (const [type, mimes] of Object.entries(ACCEPTED_MIME_TYPES) as [MediaType, string[]][]) {
    if (mimes.includes(mimeType)) return type;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ALL_ACCEPTED_MIMES = Object.values(ACCEPTED_MIME_TYPES).flat().join(',');
