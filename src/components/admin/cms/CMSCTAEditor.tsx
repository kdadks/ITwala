import React from 'react';
import { Megaphone } from 'lucide-react';

export interface CTAData {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  badge?: string;
}

interface CMSCTAEditorProps {
  data: CTAData;
  onChange: (updated: CTAData) => void;
  sectionTitle?: string;
}

export const CMSCTAEditor: React.FC<CMSCTAEditorProps> = ({
  data = {},
  onChange,
  sectionTitle = 'Call-To-Action (CTA) Banner',
}) => {
  const updateField = (field: keyof CTAData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 font-serif">
          <Megaphone className="w-4 h-4 text-accent-500" />
          {sectionTitle}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure the bottom page call-to-action banner heading, subtitle, button text, and destination link.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Banner Badge / Tagline
        </label>
        <input
          type="text"
          value={data.badge || ''}
          onChange={(e) => updateField('badge', e.target.value)}
          placeholder="e.g. 🚀 Ready to Transform Your Career or Business?"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Banner Main Title
        </label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g. Start Learning AI & Building Apps Today"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-base font-bold text-gray-900"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Banner Subtitle / Description
        </label>
        <textarea
          rows={2}
          value={data.subtitle || ''}
          onChange={(e) => updateField('subtitle', e.target.value)}
          placeholder="Join 10,000+ professionals learning AI and getting certified."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            CTA Button Label
          </label>
          <input
            type="text"
            value={data.buttonText || ''}
            onChange={(e) => updateField('buttonText', e.target.value)}
            placeholder="e.g. Get Started Now"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            CTA Button Target Link (URL)
          </label>
          <input
            type="text"
            value={data.buttonLink || ''}
            onChange={(e) => updateField('buttonLink', e.target.value)}
            placeholder="e.g. /contact or /courses"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
          />
        </div>
      </div>
    </div>
  );
};
