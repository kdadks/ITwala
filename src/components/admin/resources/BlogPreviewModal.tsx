import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Edit,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { ResourceArticle } from '@/types/resources';

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: ResourceArticle | null;
  onStatusChange?: (updated: ResourceArticle) => void;
}

export default function BlogPreviewModal({
  isOpen,
  onClose,
  blog,
  onStatusChange,
}: BlogPreviewModalProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!isOpen || !blog) return null;

  const toggleStatus = async () => {
    try {
      setIsUpdatingStatus(true);
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      const updated = { ...blog, status: newStatus as 'published' | 'draft' };

      const res = await fetch(`/api/admin/resources/${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok && onStatusChange) {
        onStatusChange(updated);
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-8 max-h-[90vh]"
        >
          {/* Admin Action Header */}
          <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-900 text-white gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full border border-primary-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
                In-Portal Preview Mode
              </span>
              <span
                className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  blog.status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {blog.status}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleStatus}
                disabled={isUpdatingStatus}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all ${
                  blog.status === 'published'
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200'
                }`}
              >
                {blog.status === 'published' ? 'Switch to Draft' : 'Publish Article'}
              </button>

              <Link
                href={`/admin/resources/edit/${blog.slug}`}
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </Link>

              <Link
                href={`/resources/${blog.slug}`}
                target="_blank"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                Public URL <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Article Scrollable Preview Body */}
          <div className="overflow-y-auto p-6 sm:p-10 space-y-8 bg-white">
            {/* Category & Badge */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 bg-primary-50 text-primary-700 rounded-full">
                {blog.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {blog.readTime}
              </span>
              <span className="text-xs text-gray-400">· {blog.difficulty}</span>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
                {blog.title}
              </h1>
              <p className="text-base text-gray-600 leading-relaxed font-medium">
                {blog.description}
              </p>
            </div>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Author Bar */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              {blog.author?.avatar ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <Image
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs">
                  IT
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-gray-900">{blog.author?.name}</div>
                <div className="text-[11px] text-gray-500">{blog.author?.role}</div>
              </div>
              <div className="ml-auto text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {blog.publishDate}
              </div>
            </div>

            {/* AEO Quick Answer Box */}
            {blog.quickAnswer && (
              <div className="p-5 bg-gradient-to-r from-primary-50 to-indigo-50/50 rounded-2xl border border-primary-100 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-primary-700 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-accent-500" />
                  Quick Answer Snippet (AEO Overview)
                </div>
                <p className="text-sm text-gray-800 font-medium leading-relaxed">
                  {blog.quickAnswer}
                </p>
              </div>
            )}

            {/* Key Takeaways */}
            {blog.keyTakeaways && blog.keyTakeaways.length > 0 && (
              <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-3">
                <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                  {blog.keyTakeaways.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections */}
            {blog.sections && blog.sections.length > 0 && (
              <div className="space-y-6 pt-2">
                {blog.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h2 className="text-lg font-bold text-gray-900">{sec.h2}</h2>
                    {sec.content && (
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {sec.content}
                      </p>
                    )}
                    {sec.codeSnippet && (
                      <pre className="p-4 bg-gray-900 text-emerald-400 rounded-2xl text-xs font-mono overflow-x-auto">
                        <code>{sec.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* FAQs Accordion */}
            {blog.faqs && blog.faqs.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary-600" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {blog.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl overflow-hidden text-sm"
                    >
                      <button
                        onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                        className="w-full px-5 py-3.5 text-left font-semibold text-gray-900 flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 transition-colors"
                      >
                        <span>{faq.question}</span>
                        <span className="text-gray-400">{openFaqIdx === idx ? '−' : '+'}</span>
                      </button>
                      {openFaqIdx === idx && (
                        <div className="px-5 py-3.5 text-xs text-gray-600 border-t border-gray-100 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Card Preview */}
            {blog.cta && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                <div>
                  <h4 className="text-base font-bold">{blog.cta.title}</h4>
                  <p className="text-xs text-primary-100 mt-1">{blog.cta.text}</p>
                </div>
                <Link
                  href={blog.cta.linkUrl || '/contact'}
                  target="_blank"
                  className="bg-white text-primary-700 hover:bg-primary-50 font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-colors inline-flex items-center gap-1.5 shrink-0"
                >
                  {blog.cta.linkText || 'Learn More'} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
