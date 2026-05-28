import { useRef, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  value: string;
  onChange: (path: string) => void;
  label?: string;
  placeholder?: string;
}

function normalizePreviewSrc(value: string): string {
  if (!value) return '';
  if (value.startsWith('public/')) return `/${value.slice(7)}`;
  return value;
}

export function ImageUploader({
  value,
  onChange,
  label,
  placeholder = 'public/images/events/example.jpg',
}: ImageUploaderProps) {
  const supabase = useSupabaseClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const previewSrc = localPreview || normalizePreviewSrc(value);

  function handleDropZoneClick() {
    fileInputRef.current?.click();
  }

  function handleUploadButtonClick() {
    fileInputRef.current?.click();
  }

  function handleClear() {
    setLocalPreview('');
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB');
      return;
    }

    setUploading(true);

    try {
      // Get session token
      const sessionResult = await supabase.auth.getSession();
      const token = sessionResult.data.session?.access_token;
      if (!token) {
        toast.error('Not authenticated');
        return;
      }

      // Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      // Keep data URL for instant local preview
      const dataUrl = `data:${file.type};base64,${base64}`;
      setLocalPreview(dataUrl);

      // Upload to server
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: file.name,
          data: base64,
          type: file.type,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error ?? 'Upload failed');
      }

      const { path } = (await response.json()) as { path: string };
      onChange(path);
    } catch (err) {
      console.error('[ImageUploader] upload error:', err);
      toast.error(err instanceof Error ? err.message : 'Upload failed');
      // Keep local preview even on failure so user can see what they chose,
      // but don't call onChange with an invalid server path.
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={handleUploadButtonClick}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors disabled:opacity-50"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Upload Image
        </button>
      </div>

      {/* Preview or drop zone */}
      {previewSrc ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt="Preview"
            className="w-full h-[140px] object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-gray-900/60 hover:bg-gray-900/80 text-white rounded-full transition-colors"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={handleDropZoneClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleDropZoneClick();
          }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
              <p className="text-xs text-gray-500">Uploading…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-2">
              <ImageIcon className="w-7 h-7 text-gray-400" />
              <p className="text-sm text-gray-600 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
            </div>
          )}
        </div>
      )}

      {/* Manual URL / path input */}
      <div className="space-y-1">
        <label className="block text-xs text-gray-500 font-medium">
          Or enter image path/URL
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setLocalPreview('');
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 text-gray-500"
        />
      </div>
    </div>
  );
}
