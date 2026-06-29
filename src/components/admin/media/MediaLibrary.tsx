import { useState, useCallback, useRef, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  Upload, Search, Trash2, Copy, Loader2, Image as ImageIcon,
  Video, FileText, X, Check, ExternalLink, Edit2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MediaAsset, MediaType, ACCEPTED_MIME_TYPES, MEDIA_TYPE_LABELS, getMediaType, formatFileSize, ALL_ACCEPTED_MIMES } from '@/types/media';

type TabFilter = 'all' | MediaType;

function TypeIcon({ type, className = 'w-8 h-8' }: { type: MediaType; className?: string }) {
  if (type === 'image')    return <ImageIcon className={`${className} text-gray-400`} />;
  if (type === 'video')    return <Video     className={`${className} text-gray-400`} />;
  return <FileText className={`${className} text-gray-400`} />;
}

function TypeBadge({ type }: { type: MediaType }) {
  const colors: Record<MediaType, string> = {
    image:    'bg-blue-50 text-blue-700',
    video:    'bg-purple-50 text-purple-700',
    document: 'bg-amber-50 text-amber-700',
  };
  return (
    <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${colors[type]}`}>
      {type}
    </span>
  );
}

interface DetailPanelProps {
  asset: MediaAsset;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<MediaAsset>) => void;
}

function DetailPanel({ asset, onClose, onDelete, onUpdate }: DetailPanelProps) {
  const [name, setName]         = useState(asset.original_name);
  const [altText, setAltText]   = useState(asset.alt_text);
  const [desc, setDesc]         = useState(asset.description);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied]     = useState(false);

  const isDirty = name !== asset.original_name || altText !== asset.alt_text || desc !== asset.description;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/media/${asset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_name: name, alt_text: altText, description: desc }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      const { asset: updated } = await res.json();
      onUpdate(asset.id, updated);
      toast.success('Saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${asset.original_name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${asset.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
      onDelete(asset.id);
      toast.success('Deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.public_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-80 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">Asset Details</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Preview */}
        <div className="rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: 160 }}>
          {asset.type === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset.public_url} alt={asset.alt_text || asset.original_name} className="w-full h-full object-cover" />
          ) : asset.type === 'video' ? (
            <video src={asset.public_url} className="w-full h-full object-cover" controls />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <FileText className="w-12 h-12" />
              <span className="text-xs">Document</span>
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <TypeBadge type={asset.type} />
          <span>{formatFileSize(asset.file_size)}</span>
          <span>·</span>
          <span>{new Date(asset.created_at).toLocaleDateString()}</span>
        </div>

        {/* Editable fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">File name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400"
            />
          </div>

          {asset.type === 'image' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Alt text</label>
              <input
                type="text"
                value={altText}
                onChange={e => setAltText(e.target.value)}
                placeholder="Describe the image for accessibility"
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              placeholder="Optional notes about this file"
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 resize-none"
            />
          </div>
        </div>

        {isDirty && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save changes
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
        <a
          href={asset.public_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open file
        </a>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-600 border border-red-100 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Delete
        </button>
      </div>
    </div>
  );
}

export function MediaLibrary() {
  const supabase = useSupabaseClient();
  const [assets, setAssets]           = useState<MediaAsset[]>([]);
  const [loading, setLoading]         = useState(true);
  const [total, setTotal]             = useState(0);
  const [tab, setTab]                 = useState<TabFilter>('all');
  const [search, setSearch]           = useState('');
  const [selectedAsset, setSelected]  = useState<MediaAsset | null>(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const getToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, [supabase]);

  const fetchAssets = useCallback(async (q?: string, t?: TabFilter) => {
    setLoading(true);
    try {
      const token = await getToken();
      const params = new URLSearchParams({ limit: '100' });
      const resolvedTab = t ?? tab;
      if (resolvedTab !== 'all') params.set('type', resolvedTab);
      const resolvedSearch = q !== undefined ? q : search;
      if (resolvedSearch.trim()) params.set('search', resolvedSearch.trim());

      const res = await fetch(`/api/admin/media?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setAssets(data.assets ?? []);
      setTotal(data.total ?? 0);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, [getToken, tab, search]);

  useEffect(() => { fetchAssets(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = (val: string) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchAssets(val), 400);
  };

  const handleTabChange = (t: TabFilter) => {
    setTab(t);
    setSelected(null);
    fetchAssets(search, t);
  };

  const handleUpload = async (file: File) => {
    const mediaType = getMediaType(file.type);
    if (!mediaType) { toast.error(`Unsupported file type: ${file.type}`); return; }

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

      const prepRes = await fetch('/api/admin/media/prepare-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, mime_type: file.type, file_size: file.size }),
      });
      if (!prepRes.ok) {
        const err = await prepRes.json().catch(() => ({}));
        throw new Error(err.error ?? 'Upload preparation failed');
      }
      const { path, token: uploadToken, storage_path } = await prepRes.json();
      setUploadProgress(35);

      const { error: uploadError } = await supabase.storage
        .from('media')
        .uploadToSignedUrl(path, uploadToken, file, { contentType: file.type });
      if (uploadError) throw new Error(uploadError.message);
      setUploadProgress(70);

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
        const err = await regRes.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to register asset');
      }
      const { asset } = await regRes.json();
      setUploadProgress(100);

      setAssets(prev => [asset, ...prev]);
      setTotal(prev => prev + 1);
      setSelected(asset);
      toast.success('File uploaded successfully');
    } catch (err: any) {
      toast.error(err.message ?? 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    setTotal(prev => prev - 1);
    setSelected(null);
  };

  const handleUpdate = (id: string, updates: Partial<MediaAsset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    if (selectedAsset?.id === id) setSelected(prev => prev ? { ...prev, ...updates } : null);
  };

  const tabs: Array<{ value: TabFilter; label: string }> = [
    { value: 'all',      label: 'All' },
    { value: 'image',    label: 'Images' },
    { value: 'video',    label: 'Videos' },
    { value: 'document', label: 'Documents' },
  ];

  return (
    <div className="flex h-full">
      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {tabs.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleTabChange(t.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  tab === t.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search files…"
                className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 w-52"
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={ALL_ACCEPTED_MIMES}
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload
            </button>
          </div>
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="mb-4 bg-primary-50 border border-primary-100 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm text-primary-700 mb-1.5">
              <span>Uploading…</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-primary-100 rounded-full h-1.5">
              <div
                className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <p className="text-xs text-gray-400 mb-3">{total} file{total !== 1 ? 's' : ''}</p>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center flex-1 py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-gray-400">
            <ImageIcon className="w-12 h-12 mb-3" />
            <p className="text-base font-medium text-gray-500 mb-1">No files yet</p>
            <p className="text-sm">Upload images, videos, or documents to get started</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Upload your first file
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 overflow-y-auto pb-4">
            {assets.map(asset => (
              <button
                key={asset.id}
                type="button"
                onClick={() => setSelected(prev => prev?.id === asset.id ? null : asset)}
                className={`group relative rounded-xl border-2 overflow-hidden transition-all text-left ${
                  selectedAsset?.id === asset.id
                    ? 'border-primary-500 ring-2 ring-primary-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {asset.type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.public_url}
                      alt={asset.alt_text || asset.original_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <TypeIcon type={asset.type} className="w-10 h-10" />
                  )}
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-700 font-medium truncate leading-tight">
                    {asset.original_name}
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-400">{formatFileSize(asset.file_size)}</p>
                    <TypeBadge type={asset.type} />
                  </div>
                </div>
                {selectedAsset?.id === asset.id && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedAsset && (
        <DetailPanel
          asset={selectedAsset}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
