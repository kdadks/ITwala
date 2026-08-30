import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Check, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaAsset {
  id: string;
  public_url: string;
  original_name: string;
  type: string;
  created_at: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Image',
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMediaAssets();
    }
  }, [isOpen]);

  const fetchMediaAssets = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/media?type=image');
      if (res.ok) {
        const data = await res.json();
        setAssets(data.assets || []);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setIsUploading(true);

      // Convert to base64 for /api/admin/upload
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            data: base64Data,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Upload failed');
        }

        const data = await response.json();
        toast.success('Image uploaded successfully');
        onSelect(data.url);
        onClose();
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredAssets = assets.filter((a) =>
    a.original_name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 px-6 gap-6">
            <button
              onClick={() => setActiveTab('library')}
              className={`py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'library'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Media Library
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upload New Image
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto flex-1 min-h-[320px]">
            {activeTab === 'library' ? (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search media library..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-16 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading media library...</span>
                  </div>
                ) : filteredAssets.length === 0 ? (
                  <div className="text-center py-16 text-gray-500 text-sm">
                    No images found in Media Library. Switch to "Upload New Image" to add one.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {filteredAssets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedUrl(asset.public_url)}
                        className={`relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          selectedUrl === asset.public_url
                            ? 'border-primary-600 ring-2 ring-primary-500/30'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={asset.public_url}
                          alt={asset.original_name}
                          fill
                          className="object-cover"
                        />
                        {selectedUrl === asset.public_url && (
                          <div className="absolute inset-0 bg-primary-600/30 flex items-center justify-center">
                            <div className="bg-primary-600 text-white rounded-full p-1 shadow">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                <Upload className="w-10 h-10 text-primary-500 mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Upload an Image to Media Library
                </p>
                <p className="text-xs text-gray-500 mb-4">PNG, JPG, WEBP or GIF up to 5MB</p>
                <label className="bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors inline-flex items-center gap-2">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Select Image File'
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Footer */}
          {activeTab === 'library' && (
            <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50 gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!selectedUrl}
                onClick={() => {
                  if (selectedUrl) {
                    onSelect(selectedUrl);
                    onClose();
                  }
                }}
                className="px-5 py-2 text-xs font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl shadow transition-all"
              >
                Use Selected Image
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
