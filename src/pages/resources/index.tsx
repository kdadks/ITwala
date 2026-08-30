import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SEOHead from '@/components/seo/SEOHead';
import BacklinkingHub from '@/components/seo/BacklinkingHub';
import { RESOURCES_DATA, ResourceCategory } from '@/data/resourcesData';
import { useCMSData } from '@/lib/cms';

const DEFAULT_RESOURCES_CMS = {
  hero: {
    badge: 'AI Learning · Free Guides & Architecture Roadmaps',
    title: 'AI & Tech Resources Hub',
    subtitle: 'Accelerate your business & career with expert-authored guides and roadmaps.',
  },
  seo: {
    metaTitle: 'AI & Tech Resources Hub - Guides, AEO Insights & Engineering Roadmaps',
    metaDescription: 'Explore 20+ free comprehensive AI guides, business automation strategies, architecture deep dives, career roadmaps, and MVP development frameworks.',
    keywords: 'AI resources, agentic AI guide, model context protocol, RAG vs fine-tuning, AI engineer roadmap',
    ogImage: '',
  },
};

const ResourcesHubPage: NextPage = () => {
  const { cmsData } = useCMSData('resources', DEFAULT_RESOURCES_CMS);
  const hero = cmsData.hero || DEFAULT_RESOURCES_CMS.hero;
  const seo = cmsData.seo || DEFAULT_RESOURCES_CMS.seo;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [resources, setResources] = useState<any[]>(RESOURCES_DATA);

  useEffect(() => {
    const fetchDynamicResources = async () => {
      try {
        const res = await fetch('/api/resources');
        if (res.ok) {
          const data = await res.json();
          if (data.resources && data.resources.length > 0) {
            setResources(data.resources);
          }
        }
      } catch {
        // fallback to static data
      }
    };
    fetchDynamicResources();
  }, []);

  const categories = [
    'All',
    'AI & Business Strategy',
    'Core AI Tech',
    'AI Learning & Career',
    'Startup & Product',
  ];

  const filteredResources = resources.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter(
    (item) => item.slug === 'what-is-agentic-ai' || item.slug === 'ai-roadmap-for-beginners-in-2026' || item.slug === 'what-is-mcp-model-context-protocol-explained'
  );

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'ITWala Resources & AEO Knowledge Hub',
    description: 'Free comprehensive AI, machine learning, technology roadmap, and software engineering resources for business leaders and students.',
    url: 'https://it-wala.com/resources',
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'ITWala Academy',
      logo: 'https://it-wala.com/images/IT - WALA_logo (1).png',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: RESOURCES_DATA.length,
      itemListElement: RESOURCES_DATA.map((item, index) => ({
        '@type': 'LearningResource',
        position: index + 1,
        name: item.title,
        description: item.description,
        url: `https://it-wala.com/resources/${item.slug}`,
        educationalLevel: item.difficulty,
        learningResourceType: item.category,
      })),
    },
  };

  return (
    <>
      <SEOHead
        title={seo.metaTitle}
        description={seo.metaDescription}
        keywords={seo.keywords}
        canonicalUrl="https://it-wala.com/resources"
        ogImage={seo.ogImage}
        schema={collectionSchema}
      />

      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white border-b border-gray-200">
          <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 lg:pt-28 lg:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-primary-500 shrink-0" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">
                  {hero.badge || 'AI Learning · Free Guides & Architecture Roadmaps'}
                </span>
              </div>
              
              <h1 className="font-serif text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[1.06] text-gray-900 mb-5">
                {hero.title}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-[3px] h-9 bg-accent-500 rounded-full shrink-0" />
                <p className="text-[1.05rem] text-gray-600 font-medium leading-snug">
                  {hero.subtitle}
                </p>
              </div>

              <p className="text-[0.97rem] text-gray-500 leading-[1.85] max-w-2xl mb-8">
                Master autonomous AI agents, enterprise RAG architectures, technical roadmaps, and MVP product frameworks with our expert-authored guides.
              </p>

              {/* Search Box */}
              <div className="max-w-xl relative mb-6">
                <input
                  type="text"
                  placeholder="Search 20+ guides (e.g. Agentic AI, RAG, Cost, MCP, Roadmap)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3.5 pl-11 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm sm:text-base shadow-sm"
                />
                <svg
                  className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap gap-2">
                {['Free Guides', 'AEO Snippets', 'Architecture Deep Dives', 'Career Roadmaps', 'Startup MVPs'].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-[12px] font-medium border border-primary-100">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Guides Banner */}
        {searchQuery === '' && selectedCategory === 'All' && (
          <section className="py-12 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Featured Pillar Guides
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Key architecture &amp; strategic guides for decision makers</p>
                </div>
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100 uppercase tracking-wider">
                  High Authority
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredResources.map((item, idx) => (
                  <Link href={`/resources/${item.slug}`} key={item.id} className="group block">
                    <div className={`bg-gradient-to-br ${
                      idx === 0 ? 'from-primary-50/70 via-white to-primary-100/40 border-primary-200/80 hover:border-primary-400' :
                      idx === 1 ? 'from-indigo-50/70 via-white to-indigo-100/40 border-indigo-200/80 hover:border-indigo-400' :
                      'from-cyan-50/70 via-white to-cyan-100/40 border-cyan-200/80 hover:border-cyan-400'
                    } rounded-2xl p-7 h-full flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 border hover:-translate-y-1.5`}>
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 text-xs font-semibold text-primary-700 bg-white rounded-full border border-primary-200/80 shadow-xs">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">{item.readTime} read</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs font-semibold text-primary-600 group-hover:text-primary-700">
                        <span>Read Comprehensive Guide</span>
                        <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Filter Tabs & Main Directory Grid */}
        <section className="py-16 container mx-auto px-4">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-primary-500/25 shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredResources.length}</span> resources
              {selectedCategory !== 'All' && <span> in <strong className="text-primary-600">{selectedCategory}</strong></span>}
            </p>
          </div>

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto border border-gray-200 shadow-sm">
              <p className="text-gray-500 text-base mb-4">No guides found matching your search term.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link href={`/resources/${item.slug}`} className="group block h-full">
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 h-full flex flex-col justify-between border border-gray-200/80 hover:border-primary-300 group-hover:-translate-y-1">
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full border border-primary-100">
                            {item.category}
                          </span>
                          <span className={`text-[11px] px-2.5 py-0.5 font-medium rounded-full ${
                            item.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            item.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {item.difficulty}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors leading-snug">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium text-gray-400">{item.readTime} read</span>
                        <div className="flex items-center font-semibold text-primary-600 group-hover:text-primary-700">
                          Read Article
                          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Backlinking Section */}
        <BacklinkingHub currentPage="resources" />
      </main>
    </>
  );
};

export default ResourcesHubPage;
