import React from 'react';
import { MediaPicker } from '@/components/admin/media/MediaPicker';
import { Globe, Eye } from 'lucide-react';

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

interface CMSSEOEditorProps {
  data: SEOData;
  onChange: (updated: SEOData) => void;
  pagePath: string;
  onOpenPreview?: () => void;
}

export const CMSSEOEditor: React.FC<CMSSEOEditorProps> = ({ data, onChange, pagePath, onOpenPreview }) => {
  const updateField = (field: keyof SEOData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            Search Engine Optimization (SEO) &amp; Social Metadata
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure Google search titles, descriptions, indexing keywords, and OpenGraph social images.
          </p>
        </div>

        {onOpenPreview && (
          <button
            type="button"
            onClick={onOpenPreview}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Eye className="w-4 h-4" />
            SERP &amp; Card Preview Modal
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Google Title Tag
            </label>
            <span className={`text-xs font-mono font-semibold ${
              (data.metaTitle?.length || 0) > 60 ? 'text-amber-600' : 'text-gray-400'
            }`}>
              {data.metaTitle?.length || 0}/60 chars
            </span>
          </div>
          <input
            type="text"
            value={data.metaTitle || ''}
            onChange={(e) => updateField('metaTitle', e.target.value)}
            placeholder="e.g. Comprehensive IT Courses & Training | ITwala Academy"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Meta Search Description
            </label>
            <span className={`text-xs font-mono font-semibold ${
              (data.metaDescription?.length || 0) > 160 ? 'text-amber-600' : 'text-gray-400'
            }`}>
              {data.metaDescription?.length || 0}/160 chars
            </span>
          </div>
          <textarea
            rows={3}
            value={data.metaDescription || ''}
            onChange={(e) => updateField('metaDescription', e.target.value)}
            placeholder="Summary snippet displayed under your title in search results..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Search Keywords (comma separated)
          </label>
          <input
            type="text"
            value={data.keywords || ''}
            onChange={(e) => updateField('keywords', e.target.value)}
            placeholder="e.g. IT training, DevOps course, React tutorial, certifications"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <MediaPicker
            label="Social Share Image (Open Graph Banner Image)"
            value={data.ogImage || ''}
            onChange={(url) => updateField('ogImage', url)}
            accept="image"
          />
        </div>
      </div>
    </div>
  );
};
