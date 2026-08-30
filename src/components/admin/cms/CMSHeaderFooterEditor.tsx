import React from 'react';
import { Layout, MessageSquare, Phone, Mail, Globe, MapPin, Share2 } from 'lucide-react';

export interface HeaderFooterData {
  header?: {
    showAnnouncement?: boolean;
    announcementText?: string;
    announcementLink?: string;
    announcementCta?: string;
    brandName?: string;
    brandTagline?: string;
    phoneHotline?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
  };
  footer?: {
    aboutText?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    copyrightText?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    githubUrl?: string;
    instagramUrl?: string;
  };
}

interface CMSHeaderFooterEditorProps {
  data: HeaderFooterData;
  onChange: (updated: HeaderFooterData) => void;
}

export const CMSHeaderFooterEditor: React.FC<CMSHeaderFooterEditorProps> = ({ data, onChange }) => {
  const header = data.header || {};
  const footer = data.footer || {};

  const updateHeader = (field: string, value: any) => {
    onChange({
      ...data,
      header: { ...header, [field]: value },
    });
  };

  const updateFooter = (field: string, value: any) => {
    onChange({
      ...data,
      footer: { ...footer, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      {/* Global Header & Navigation Settings */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 font-serif">
            <Layout className="w-4 h-4 text-primary-500" />
            Global Website Header &amp; Top Navigation
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure site announcement bar, brand name, hotline phone, and top navigation CTA.
          </p>
        </div>

        {/* Announcement Bar Toggle */}
        <div className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-600" />
              Header Announcement Bar (Top Banner)
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={header.showAnnouncement ?? true}
                onChange={(e) => updateHeader('showAnnouncement', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500" />
              <span className="ml-2 text-xs font-bold text-gray-700">
                {header.showAnnouncement ? 'Active' : 'Disabled'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Announcement Message</label>
              <input
                type="text"
                value={header.announcementText || ''}
                onChange={(e) => updateHeader('announcementText', e.target.value)}
                placeholder="e.g. ⚡ New AI Crash Course Started! Enrol now for 20% off"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Link URL</label>
              <input
                type="text"
                value={header.announcementLink || ''}
                onChange={(e) => updateHeader('announcementLink', e.target.value)}
                placeholder="e.g. /courses"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white"
              />
            </div>
          </div>
        </div>

        {/* Brand & Hotline Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Brand Title
            </label>
            <input
              type="text"
              value={header.brandName || 'ITwala'}
              onChange={(e) => updateHeader('brandName', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Brand Tagline
            </label>
            <input
              type="text"
              value={header.brandTagline || "IT - It's Simple"}
              onChange={(e) => updateHeader('brandTagline', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Phone Helpline Hotline
            </label>
            <input
              type="text"
              value={header.phoneHotline || '+91 98765 43210'}
              onChange={(e) => updateHeader('phoneHotline', e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {/* Global Footer Settings */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 font-serif">
            <Globe className="w-4 h-4 text-accent-500" />
            Global Website Footer Settings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage footer description, contact email, phone, office address, copyright note, and social links.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Footer About Summary
          </label>
          <textarea
            rows={2}
            value={footer.aboutText || ''}
            onChange={(e) => updateFooter('aboutText', e.target.value)}
            placeholder="Empowering professionals with cutting-edge AI and technology skills..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-primary-500" /> Support Email
            </label>
            <input
              type="email"
              value={footer.contactEmail || ''}
              onChange={(e) => updateFooter('contactEmail', e.target.value)}
              placeholder="contact@it-wala.com"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-500" /> Support Phone
            </label>
            <input
              type="text"
              value={footer.contactPhone || ''}
              onChange={(e) => updateFooter('contactPhone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-accent-500" /> Office Location Address
            </label>
            <input
              type="text"
              value={footer.address || ''}
              onChange={(e) => updateFooter('address', e.target.value)}
              placeholder="Varanasi, Eastern UP, India"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Footer Copyright Statement
          </label>
          <input
            type="text"
            value={footer.copyrightText || ''}
            onChange={(e) => updateFooter('copyrightText', e.target.value)}
            placeholder="© 2026 ITwala. All rights reserved."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm"
          />
        </div>

        {/* Social Media Links */}
        <div className="pt-2 border-t border-gray-100 space-y-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-primary-500" />
            Social Media Profile Links
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={footer.linkedinUrl || ''}
              onChange={(e) => updateFooter('linkedinUrl', e.target.value)}
              placeholder="LinkedIn URL (https://linkedin.com/...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
            />
            <input
              type="text"
              value={footer.twitterUrl || ''}
              onChange={(e) => updateFooter('twitterUrl', e.target.value)}
              placeholder="Twitter / X URL (https://x.com/...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
            />
            <input
              type="text"
              value={footer.githubUrl || ''}
              onChange={(e) => updateFooter('githubUrl', e.target.value)}
              placeholder="GitHub URL (https://github.com/...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
            />
            <input
              type="text"
              value={footer.instagramUrl || ''}
              onChange={(e) => updateFooter('instagramUrl', e.target.value)}
              placeholder="Instagram URL (https://instagram.com/...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
