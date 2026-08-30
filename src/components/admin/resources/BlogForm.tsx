import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Loader2,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ResourceArticle, ResourceCategory } from '@/types/resources';
import MediaPickerModal from '@/components/admin/media/MediaPickerModal';

interface BlogFormProps {
  initialData?: Partial<ResourceArticle>;
  isEditing?: boolean;
}

const CATEGORIES: ResourceCategory[] = [
  'AI & Business Strategy',
  'Core AI Tech',
  'AI Learning & Career',
  'Startup & Product',
];

export default function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'cover' | 'avatar' | 'section'>('cover');
  const [activeSectionIdx, setActiveSectionIdx] = useState<number | null>(null);

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [quickAnswer, setQuickAnswer] = useState(initialData?.quickAnswer || '');
  const [primaryGoal, setPrimaryGoal] = useState(initialData?.primaryGoal || '');
  const [category, setCategory] = useState<ResourceCategory>(
    initialData?.category || 'AI & Business Strategy'
  );
  const [readTime, setReadTime] = useState(initialData?.readTime || '5 min read');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    initialData?.difficulty || 'Beginner'
  );
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published');
  const [schemaType, setSchemaType] = useState<'TechArticle' | 'Article' | 'HowTo'>(
    initialData?.schemaType || 'TechArticle'
  );
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '');
  const [keywords, setKeywords] = useState<string>(
    initialData?.keywords ? initialData.keywords.join(', ') : ''
  );

  // Author
  const [authorName, setAuthorName] = useState(initialData?.author?.name || 'ITWala Team');
  const [authorRole, setAuthorRole] = useState(initialData?.author?.role || 'AI Specialist');
  const [authorAvatar, setAuthorAvatar] = useState(
    initialData?.author?.avatar || '/images/IT - WALA_logo (1).png'
  );

  // Key Takeaways
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>(
    initialData?.keyTakeaways || ['Summary takeaway #1']
  );

  // FAQs
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    initialData?.faqs || [{ question: 'What is this guide about?', answer: 'This guide covers key concepts.' }]
  );

  // Sections
  const [sections, setSections] = useState<Array<{ h2: string; content?: string; codeSnippet?: string }>>(
    initialData?.sections || [
      { h2: '1. Introduction', content: 'Write introduction section details here...' },
    ]
  );

  // CTA
  const [ctaTitle, setCtaTitle] = useState(initialData?.cta?.title || 'Accelerate Your AI Journey');
  const [ctaText, setCtaText] = useState(
    initialData?.cta?.text || 'Explore expert AI courses and consulting with ITWala.'
  );
  const [ctaLinkText, setCtaLinkText] = useState(initialData?.cta?.linkText || 'Browse Courses');
  const [ctaLinkUrl, setCtaLinkUrl] = useState(initialData?.cta?.linkUrl || '/courses');
  const [ctaVariant, setCtaVariant] = useState<'consulting' | 'academy' | 'product'>(
    initialData?.cta?.variant || 'academy'
  );

  // Auto-generate slug from title if title changes and not manually edited
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing && !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generated);
    }
  };

  const handleOpenMediaPicker = (target: 'cover' | 'avatar' | 'section', sectionIdx: number | null = null) => {
    setMediaPickerTarget(target);
    setActiveSectionIdx(sectionIdx);
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaPickerTarget === 'cover') {
      setFeaturedImage(url);
    } else if (mediaPickerTarget === 'avatar') {
      setAuthorAvatar(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast.error('Title and Slug are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: Partial<ResourceArticle> = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        quickAnswer: quickAnswer.trim(),
        primaryGoal: primaryGoal.trim(),
        category,
        readTime: readTime.trim(),
        difficulty,
        status,
        schemaType,
        featuredImage: featuredImage.trim(),
        keywords: keywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
        author: {
          name: authorName.trim(),
          role: authorRole.trim(),
          avatar: authorAvatar.trim(),
        },
        keyTakeaways: keyTakeaways.filter((t) => t.trim() !== ''),
        faqs: faqs.filter((f) => f.question.trim() !== '' && f.answer.trim() !== ''),
        sections: sections.filter((s) => s.h2.trim() !== ''),
        cta: {
          title: ctaTitle.trim(),
          text: ctaText.trim(),
          linkText: ctaLinkText.trim(),
          linkUrl: ctaLinkUrl.trim(),
          variant: ctaVariant,
        },
      };

      const url = isEditing && initialData?.id
        ? `/api/admin/resources/${initialData.id}`
        : '/api/admin/resources';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save blog post');
      }

      toast.success(isEditing ? 'Blog updated successfully!' : 'Blog created successfully!');
      router.push('/admin/resources');
    } catch (err: any) {
      toast.error(err?.message || 'Error saving blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => router.push('/admin/resources')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog List
        </button>
        <h1 className="text-xl font-bold text-gray-900">
          {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="w-5 h-5 text-primary-600" />
            General Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Blog Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Master AI Engineering in 2026"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="master-ai-engineering-2026"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Short Description / Meta Summary *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what readers will learn in this post..."
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm bg-white font-medium text-gray-900"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Cover Image via Media Library */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <ImageIcon className="w-5 h-5 text-primary-600" />
            Featured Cover Image (Media Library Integration)
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {featuredImage ? (
              <div className="relative w-40 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                <Image src={featuredImage} alt="Cover" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-40 h-24 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 text-xs shrink-0">
                No Image Chosen
              </div>
            )}
            <div className="space-y-2 flex-1">
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="Image URL (e.g. /images/blog-cover.jpg)"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={() => handleOpenMediaPicker('cover')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-primary-600" />
                Select / Upload from Media Library
              </button>
            </div>
          </div>
        </div>

        {/* Author Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
            Author Details
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Author Role / Title
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Avatar Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={authorAvatar}
                  onChange={(e) => setAuthorAvatar(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleOpenMediaPicker('avatar')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 rounded-xl transition-colors shrink-0"
                >
                  Media
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AEO & Content Highlights */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
            AEO Snippet &amp; Key Takeaways
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              AEO Quick Answer Snippet (SearchGPT / Perplexity direct answer)
            </label>
            <textarea
              rows={2}
              value={quickAnswer}
              onChange={(e) => setQuickAnswer(e.target.value)}
              placeholder="Direct 2-sentence concise summary answering the article's core question..."
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Key Takeaways
              </label>
              <button
                type="button"
                onClick={() => setKeyTakeaways([...keyTakeaways, ''])}
                className="text-xs text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Takeaway
              </button>
            </div>
            <div className="space-y-2">
              {keyTakeaways.map((t, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={t}
                    onChange={(e) => {
                      const updated = [...keyTakeaways];
                      updated[idx] = e.target.value;
                      setKeyTakeaways(updated);
                    }}
                    placeholder={`Takeaway #${idx + 1}`}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setKeyTakeaways(keyTakeaways.filter((_, i) => i !== idx))}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Sections Builder */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary-600" />
              Article Content Sections ({sections.length})
            </h2>
            <button
              type="button"
              onClick={() =>
                setSections([...sections, { h2: `${sections.length + 1}. New Heading`, content: '' }])
              }
              className="bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Section Block
            </button>
          </div>

          <div className="space-y-6">
            {sections.map((sec, idx) => (
              <div key={idx} className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Section #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSections(sections.filter((_, i) => i !== idx))}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Block
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Section Sub-heading (H2)
                  </label>
                  <input
                    type="text"
                    value={sec.h2}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[idx].h2 = e.target.value;
                      setSections(updated);
                    }}
                    placeholder="e.g. Understanding Model Context Protocol"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Section Content Paragraphs
                  </label>
                  <textarea
                    rows={4}
                    value={sec.content || ''}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[idx].content = e.target.value;
                      setSections(updated);
                    }}
                    placeholder="Write detailed paragraph content for this section..."
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Code Snippet (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={sec.codeSnippet || ''}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[idx].codeSnippet = e.target.value;
                      setSections(updated);
                    }}
                    placeholder="const agent = new Agent({ model: 'gpt-4o' });"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-mono bg-gray-900 text-green-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic FAQs Builder */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary-600" />
              Frequently Asked Questions (FAQs) ({faqs.length})
            </h2>
            <button
              type="button"
              onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
              className="bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    FAQ #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[idx].question = e.target.value;
                    setFaqs(updated);
                  }}
                  placeholder="Question text..."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                />
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...faqs];
                    updated[idx].answer = e.target.value;
                    setFaqs(updated);
                  }}
                  placeholder="Answer explanation..."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SEO & Keywords */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
            SEO &amp; Keywords
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="agentic AI, artificial intelligence, workflow automation"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push('/admin/resources')}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow transition-all inline-flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Blog Post' : 'Publish Blog Post'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Reusable Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        title={mediaPickerTarget === 'cover' ? 'Select Featured Cover Image' : 'Select Author Avatar Image'}
      />
    </div>
  );
}
