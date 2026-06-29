import { useState, useCallback, useRef, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  X, Upload, Search, Check, Loader2, Image as ImageIcon,
  Video, FileText, ImagePlus, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MediaAsset, MediaType, ACCEPTED_MIME_TYPES, MEDIA_TYPE_LABELS, getMediaType, formatFileSize, ALL_ACCEPTED_MIMES } from '@/types/media';

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  accept?: MediaType | 'any';
  label?: string;
}

const TYPE_ICONS: Record<MediaType, React.ReactNode> = {
  image:    <ImageIcon className="w-4 h-4" />,
  video:    <Video className="w-4 h-4" />,
  document: <FileText className="w-4 h-4" />,
};

function AssetCard({ asset, selected, onClick }: { asset: MediaAsset; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative group rounded-lg border-2 overflow-hidden transition-all text-left ${
        selected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200 hover:border-primary-300'
      }`}
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {asset.type === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.public_url} alt={asset.alt_text || asset.original_name} className="w-full h-full object-cover" />
        ) : asset.type === 'video' ? (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <Video className="w-8 h-8" />
            <span className="text-xs">Video</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <FileText className="w-8 h-8" />
            <span className="text-xs">Doc</span>
          </div>
        )}
      </div>
      <div className="p-1.5 bg-white">
        <p className="text-xs text-gray-700 font-medium truncate">{asset.original_name}</p>
        <p className="text-xs text-gray-400">{formatFileSize(asset.file_size)}</p>
      </div>
      {selected && (
        <div className="absolute top-1 right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}

export function MediaPicker({ value, onChange, accept = 'any', label }: MediaPickerProps) {
  const supabase = useSupabaseClient();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'library' | 'upload'>('library');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const getToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, [supabase]);

  const fetchAssets = useCallback(async (q?: string, t?: MediaType | 'all') => {
    setLoading(true);
    try {
      const token = await getToken();
      const params = new URLSearchParams({ limit: '60' });
      const resolvedType = t ?? typeFilter;
      if (resolvedType !== 'all') params.set('type', resolvedType);
      if (accept !== 'any') params.set('type', accept);
      if (q !== undefined ? q.trim() : search.trim()) params.set('search', q !== undefined ? q : search);

      const res = await fetch(`/api/admin/media?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load media');
      const data = await res.json();
      setAssets(data.assets ?? []);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to load media library');
    } finally {
      setLoading(false);
    }
  }, [getToken, search, typeFilter, accept]);

  useEffect(() => {
    if (open && tab === 'library') fetchAssets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tab]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchAssets(val), 400);
  };

  const handleTypeFilter = (t: MediaType | 'all') => {
    setTypeFilter(t);
    fetchAssets(search, t);
  };

  const handleSelect = () => {
    const asset = assets.find(a => a.id === selectedId);
    if (!asset) return;
    onChange(asset.public_url);
    setOpen(false);
    setSelectedId(null);
  };

  const handleUpload = async (file: File) => {
    const mediaType = getMediaType(file.type);
    if (!mediaType) {
      toast.error(`Unsupported file type: ${file.type}`);
      return;
    }
    if (accept !== 'any' && mediaType !== accept) {
      toast.error(`Only ${accept} files are accepted here`);
      return;
    }
    const maxBytes = MEDIA_TYPE_LABELS[mediaType].maxMB * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`File too large. Max ${MEDIA_TYPE_LABELS[mediaType].maxMB} MB for ${mediaType}s`);
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      // Step 1: get signed upload URL
      const prepRes = await fetch('/api/admin/media/prepare-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, mime_type: file.type, file_size: file.size }),
      });
      if (!prepRes.ok) {
        const err = await prepRes.json().catch(() => ({ error: 'Prepare failed' }));
        throw new Error(err.error ?? 'Upload preparation failed');
      }
      const { path, token: uploadToken, storage_path } = await prepRes.json();
      setUploadProgress(30);

      // Step 2: upload directly to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .uploadToSignedUrl(path, uploadToken, file, { contentType: file.type });
      if (uploadError) throw new Error(uploadError.message);
      setUploadProgress(75);

      // Step 3: register in DB
      const regRes = await fetch('/api/admin/media/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          storage_path,
          original_name: file.name,
          mime_type: file.type,
          file_size: file.size,
          media_type: mediaType,
        }),
      });
      if (!regRes.ok) {
        const err = await regRes.json().catch(() => ({ error: 'Register failed' }));
        throw new Error(err.error ?? 'Failed to save asset');
      }
      const { asset } = await regRes.json();
      setUploadProgress(100);

      toast.success('File uploaded');
      onChange(asset.public_url);
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptedMimes = accept === 'any'
    ? ALL_ACCEPTED_MIMES
    : ACCEPTED_MIME_TYPES[accept].join(',');

  const typeFilterOptions: Array<{ value: MediaType | 'all'; label: string }> = accept === 'any'
    ? [
        { value: 'all',      label: 'All' },
        { value: 'image',    label: 'Images' },
        { value: 'video',    label: 'Videos' },
        { value: 'document', label: 'Documents' },
      ]
    : [{ value: accept, label: accept.charAt(0).toUpperCase() + accept.slice(1) + 's' }];

  const isImage = value && (value.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i) || value.startsWith('http'));
  const isVideo = value && value.match(/\.(mp4|webm|mov|ogg)(\?|$)/i);

  return (
    <>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

      {/* Current value preview */}
      <div className="space-y-2">
        {value ? (
          <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            {isVideo ? (
              <video src={value} className="w-full h-36 object-cover" muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="Selected media" className="w-full h-36 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-6 h-6 bg-gray-900/60 hover:bg-gray-900/80 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          {value ? 'Change media' : 'Choose from Media Library'}
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Media Library</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-5">
              <button
                type="button"
                onClick={() => setTab('library')}
                className={`py-2.5 px-1 text-sm font-medium border-b-2 mr-6 transition-colors ${
                  tab === 'library' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Library
              </button>
              <button
                type="button"
                onClick={() => setTab('upload')}
                className={`py-2.5 px-1 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'upload' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Upload New
              </button>
            </div>

            {tab === 'library' && (
              <>
                {/* Filters */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50">
                  {accept === 'any' && (
                    <div className="flex gap-1">
                      {typeFilterOptions.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleTypeFilter(opt.value)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                            typeFilter === opt.value
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={e => handleSearchChange(e.target.value)}
                      placeholder="Search by filename…"
                      className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                    </div>
                  ) : assets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <p className="text-sm">No media found</p>
                      <button type="button" onClick={() => setTab('upload')} className="mt-2 text-sm text-primary-600 hover:underline">
                        Upload your first file
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {assets.map(asset => (
                        <AssetCard
                          key={asset.id}
                          asset={asset}
                          selected={selectedId === asset.id}
                          onClick={() => setSelectedId(prev => prev === asset.id ? null : asset.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <span className="text-xs text-gray-400">{assets.length} file{assets.length !== 1 ? 's' : ''}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSelect}
                      disabled={!selectedId}
                      className="px-4 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-40 transition-colors"
                    >
                      Use selected
                    </button>
                  </div>
                </div>
              </>
            )}

            {tab === 'upload' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptedMimes}
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Uploading… {uploadProgress}%</p>
                  </div>
                ) : (
                  <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/20 transition-colors"
                  >
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-400">
                      {accept === 'any'
                        ? 'Images (10MB), Videos (200MB), Documents (10MB)'
                        : `${MEDIA_TYPE_LABELS[accept].extensions} — max ${MEDIA_TYPE_LABELS[accept].maxMB} MB`
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
