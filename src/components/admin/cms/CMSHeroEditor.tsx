import React from 'react';
import { MediaPicker } from '@/components/admin/media/MediaPicker';
import { Sparkles, Eye } from 'lucide-react';

export interface HeroData {
  badge?: string;
  title: string;
  subtitle: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgImage?: string;
  accentColor?: string;
}

interface CMSHeroEditorProps {
  data: HeroData;
  onChange: (updated: HeroData) => void;
  pageName: string;
  onOpenPreview?: () => void;
}

export const CMSHeroEditor: React.FC<CMSHeroEditorProps> = ({ data, onChange, pageName, onOpenPreview }) => {
  const updateField = (field: keyof HeroData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const accentColors = [
    { name: 'Steel Blue (Primary)', value: 'indigo', class: 'from-primary-600 to-secondary-500' },
    { name: 'Warm Orange (Accent)', value: 'amber', class: 'from-accent-500 to-amber-500' },
    { name: 'Emerald / Teal', value: 'emerald', class: 'from-emerald-600 to-teal-500' },
    { name: 'Rose / Coral', value: 'rose', class: 'from-rose-600 to-orange-500' },
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            Hero Section &amp; Banner Content ({pageName})
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure main title, subtitle, tagline badge, action buttons, and hero images.
          </p>
        </div>

        {onOpenPreview && (
          <button
            type="button"
            onClick={onOpenPreview}
            className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Eye className="w-4 h-4" />
            Preview Page Modal
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Top Eyebrow Badge Tagline
          </label>
          <input
            type="text"
            value={data.badge || ''}
            onChange={(e) => updateField('badge', e.target.value)}
            placeholder="e.g. ⚡ Premier Tech Education & IT Services"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Color Theme Gradient Accent
          </label>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {accentColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => updateField('accentColor', color.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${
                  (data.accentColor || 'indigo') === color.value
                    ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${color.class}`} />
                {color.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Main Page Headline
        </label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Main headline for the page"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-base font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Subtitle / Introductory Description
        </label>
        <textarea
          rows={3}
          value={data.subtitle || ''}
          onChange={(e) => updateField('subtitle', e.target.value)}
          placeholder="Detailed introduction text for site visitors..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Primary Action Button Label
          </label>
          <input
            type="text"
            value={data.primaryCtaText || ''}
            onChange={(e) => updateField('primaryCtaText', e.target.value)}
            placeholder="e.g. Explore Courses"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Primary Action Button Link (URL)
          </label>
          <input
            type="text"
            value={data.primaryCtaLink || ''}
            onChange={(e) => updateField('primaryCtaLink', e.target.value)}
            placeholder="e.g. /courses"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Secondary Action Button Label
          </label>
          <input
            type="text"
            value={data.secondaryCtaText || ''}
            onChange={(e) => updateField('secondaryCtaText', e.target.value)}
            placeholder="e.g. View Portfolio"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Secondary Action Button Link (URL)
          </label>
          <input
            type="text"
            value={data.secondaryCtaLink || ''}
            onChange={(e) => updateField('secondaryCtaLink', e.target.value)}
            placeholder="e.g. /portfolio"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <MediaPicker
          label="Hero Background / Showcase Image"
          value={data.bgImage || ''}
          onChange={(url) => updateField('bgImage', url)}
          accept="image"
        />
      </div>
    </div>
  );
};
