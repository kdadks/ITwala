import { useState } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import SEOHead from '@/components/seo/SEOHead';
import BacklinkingHub from '@/components/seo/BacklinkingHub';
import {
  RESOURCES_DATA,
  getResourceBySlug,
  getRelatedResources,
  ResourceArticle,
} from '@/data/resourcesData';

interface ResourceArticlePageProps {
  article: ResourceArticle;
  relatedArticles: ResourceArticle[];
}

const ResourceArticlePage: NextPage<ResourceArticlePageProps> = ({
  article,
  relatedArticles,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!article) return null;

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const canonicalUrl = `https://it-wala.com/resources/${article.slug}`;

  const breadcrumbs = [
    { name: 'Home', url: 'https://it-wala.com' },
    { name: 'Resources', url: 'https://it-wala.com/resources' },
    { name: article.title, url: canonicalUrl },
  ];

  // Dynamic Schema for AEO & Google Search
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': article.schemaType,
    headline: article.title,
    description: article.description,
    mainEntityOfPage: canonicalUrl,
    datePublished: article.publishDate,
    dateModified: article.updatedDate,
    author: {
      '@type': 'Organization',
      name: article.author.name,
      url: 'https://it-wala.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ITWala Academy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://it-wala.com/images/IT - WALA_logo (1).png',
      },
    },
    keywords: article.keywords.join(', '),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.description}
        keywords={article.keywords.join(', ')}
        canonicalUrl={canonicalUrl}
        ogType="article"
        breadcrumbs={breadcrumbs}
        schema={[articleSchema, faqSchema]}
      />

      <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Article Header Hero */}
        <header className="bg-white border-b border-gray-200 pt-24 pb-8 sm:pb-10">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Ultra-compact Breadcrumb (Reduced by 75%) */}
            <nav className="flex items-center space-x-1.5 text-[11px] text-gray-400 mb-4 py-1">
              <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/resources" className="hover:text-primary-600 transition-colors">Resources</Link>
              <span>/</span>
              <span className="text-gray-600 font-medium truncate max-w-xs sm:max-w-md">{article.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200">
                {article.category}
              </span>
              <span className="text-xs text-gray-500 font-medium">{article.readTime} read</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">Updated: {article.updatedDate}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
              {article.description}
            </p>

            {/* E-E-A-T Author Card */}
            <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
              <div className="w-12 h-12 rounded-full bg-primary-100 p-1 shrink-0 border border-primary-200">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={48}
                  height={48}
                  className="rounded-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{article.author.name}</h4>
                <p className="text-xs text-gray-500">{article.author.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Layout */}
        <div className="container mx-auto px-4 max-w-4xl py-12">
          {/* AEO Direct Answer Box (Snippet Extraction) */}
          <section className="bg-amber-50/90 border-l-4 border-amber-500 rounded-r-2xl p-6 sm:p-8 mb-10 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>AEO Quick Summary (TL;DR)</span>
            </div>
            <p className="text-base sm:text-lg font-medium text-amber-950 leading-relaxed">
              {article.quickAnswer}
            </p>
          </section>

          {/* Key Takeaways */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-sm mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-6 bg-primary-600 rounded-full mr-3" />
              Key Takeaways
            </h3>
            <ul className="space-y-3">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start text-sm sm:text-base text-gray-700 leading-relaxed">
                  <span className="text-primary-600 font-bold mr-3 shrink-0">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Table of Contents */}
          {article.sections.length > 1 && (
            <nav className="bg-slate-100/80 rounded-2xl p-6 mb-12 border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                Table of Contents
              </h4>
              <ol className="space-y-2">
                {article.sections.map((sec, idx) => (
                  <li key={idx}>
                    <a
                      href={`#section-${idx}`}
                      className="text-sm text-primary-700 hover:text-primary-900 hover:underline font-medium"
                    >
                      {idx + 1}. {sec.h2}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Article Sections */}
          <article className="prose prose-slate max-w-none mb-16">
            {article.sections.map((sec, idx) => (
              <div key={idx} id={`section-${idx}`} className="mb-12 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 mb-4 border-b border-gray-200 pb-3">
                  {sec.h2}
                </h2>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                  {sec.content}
                </p>

                {/* Optional Table Rendering */}
                {sec.table && (
                  <div className="overflow-x-auto my-6 border border-gray-200 rounded-xl shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {sec.table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-4 py-3 text-left font-bold text-gray-900 uppercase tracking-wider text-xs">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {sec.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-4 py-3 text-gray-700 font-medium">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </article>

          {/* Contextual Lead CTA Card */}
          <section className={`rounded-3xl p-8 sm:p-10 mb-16 text-white shadow-xl ${
            article.cta.variant === 'academy'
              ? 'bg-gradient-to-br from-indigo-900 via-primary-800 to-slate-900 border border-indigo-700/50'
              : article.cta.variant === 'product'
              ? 'bg-gradient-to-br from-slate-900 via-primary-900 to-indigo-950 border border-slate-700/50'
              : 'bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 border border-primary-700/50'
          }`}>
            <div className="max-w-2xl">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-amber-300 uppercase tracking-widest mb-4 inline-block">
                Take Action With ITWala
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-4">
                {article.cta.title}
              </h3>
              <p className="text-primary-100 text-sm sm:text-base leading-relaxed mb-8">
                {article.cta.text}
              </p>
              <Link
                href={article.cta.linkUrl}
                className="inline-flex items-center px-8 py-4 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold rounded-xl transition-all shadow-lg hover:scale-105"
              >
                {article.cta.linkText}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </section>

          {/* FAQ Accordion Section */}
          {article.faqs.length > 0 && (
            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {article.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex justify-between items-center bg-gray-50/50 hover:bg-gray-100/80 transition-colors font-semibold text-gray-900 text-sm sm:text-base"
                    >
                      <span>{faq.question}</span>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 shrink-0 ${
                          openFaqIndex === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaqIndex === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="p-5 text-sm sm:text-base text-gray-700 leading-relaxed border-t border-gray-100 bg-white">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <section className="mb-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Related Technical Guides
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Link href={`/resources/${rel.slug}`} key={rel.id} className="group block">
                    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between group-hover:border-primary-300">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                          {rel.title}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-primary-600 flex items-center mt-3">
                        Read Guide &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Backlinking Hub */}
        <BacklinkingHub currentPage="resource-article" />
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { getAllResources } = await import('@/lib/resourcesService');
  const allArticles = await getAllResources(false);
  const paths = allArticles.map((article) => ({
    params: { slug: article.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const { getResourceBySlug, getAllResources } = await import('@/lib/resourcesService');
  const article = await getResourceBySlug(slug);

  if (!article) {
    return {
      notFound: true,
      revalidate: 10,
    };
  }

  const all = await getAllResources(false);
  const relatedArticles = all
    .filter((r) => r.slug !== slug && r.category === article.category)
    .slice(0, 3);

  return {
    props: {
      article,
      relatedArticles,
    },
    revalidate: 60,
  };
};

export default ResourceArticlePage;
