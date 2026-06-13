import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import CourseFilter from '@/components/courses/CourseFilter';
import CourseGrid from '../../components/courses/CourseGrid';
import BacklinkingHub from '@/components/seo/BacklinkingHub';
import { motion } from 'framer-motion';
import { Course } from '@/types/course';
import { getCountryFromCookie, SUPPORTED_COUNTRIES } from '@/utils/countryDetection';

interface CoursePricing {
  price: number;
  originalPrice: number | null;
  currency: string;
  symbol: string;
}

const CoursesPage: NextPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  // Categories/levels fetched once from /api/courses/meta — never re-derived from results
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);

  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userCountry, setUserCountry] = useState<string>(() =>
    typeof window !== 'undefined' ? getCountryFromCookie() : 'IN'
  );
  const [suggestionPricing, setSuggestionPricing] = useState<Record<string, CoursePricing>>({});

  // Country is set by middleware on every request — no client-side detection needed.

  // Fetch categories/levels once on mount — long-lived, separate from course results
  useEffect(() => {
    fetch('/api/courses/meta')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setCategories(data.categories || []);
          setLevels(data.levels || []);
        }
      })
      .catch(() => {/* non-critical — filters still render without meta */});
  }, []);

  const buildParams = useCallback((extraOffset = 0) => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (selectedLevel !== 'all') params.append('level', selectedLevel);
    if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] < 50000) params.append('maxPrice', priceRange[1].toString());
    if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
    params.append('sortBy', sortBy);
    params.append('country', userCountry);
    if (extraOffset > 0) params.append('offset', extraOffset.toString());
    return params;
  }, [selectedCategory, selectedLevel, priceRange, debouncedSearchQuery, sortBy, userCountry]);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setOffset(0);

      const response = await fetch(`/api/courses?${buildParams(0).toString()}`);
      if (!response.ok) throw new Error('Failed to load courses');

      const data = await response.json();
      setCourses(data.courses || []);
      setHasMore(data.hasMore ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  const loadMore = async () => {
    const nextOffset = offset + 24;
    try {
      setLoadingMore(true);
      const response = await fetch(`/api/courses?${buildParams(nextOffset).toString()}`);
      if (!response.ok) throw new Error('Failed to load courses');

      const data = await response.json();
      setCourses(prev => [...prev, ...(data.courses || [])]);
      setHasMore(data.hasMore ?? false);
      setOffset(nextOffset);
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Type-ahead suggestions — debounced at 350ms (was 200ms)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setSuggestionPricing({});
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/courses?search=${encodeURIComponent(searchQuery)}&limit=5&country=${userCountry}`
        );
        if (response.ok) {
          const data = await response.json();
          const fetched: Course[] = data.courses || [];
          setSuggestions(fetched);
          setShowSuggestions(true);

          const pricingMap: Record<string, CoursePricing> = {};
          fetched.forEach(c => {
            if (c.pricing) pricingMap[c.id] = c.pricing as CoursePricing;
          });
          setSuggestionPricing(pricingMap);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, userCountry]);

  // Debounce main search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync URL params with filters — only once when router is ready
  useEffect(() => {
    if (!router.isReady) return;

    let hasChanges = false;
    if (typeof router.query.search === 'string' && router.query.search !== searchQuery) {
      setSearchQuery(router.query.search);
      setDebouncedSearchQuery(router.query.search);
      hasChanges = true;
    }
    if (typeof router.query.category === 'string' && router.query.category !== selectedCategory) {
      setSelectedCategory(router.query.category);
      hasChanges = true;
    }
    if (typeof router.query.level === 'string' && router.query.level !== selectedLevel) {
      setSelectedLevel(router.query.level);
      hasChanges = true;
    }
    if (!hasChanges) {
      // No URL params — safe to trigger first fetch
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // Re-fetch when filters change
  useEffect(() => {
    if (router.isReady && userCountry) {
      fetchCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedLevel, priceRange, sortBy, debouncedSearchQuery, userCountry]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>AI Courses & ML Training - ITwala Academy</title>
        <meta name="description" content="Master AI with comprehensive courses in artificial intelligence, machine learning, and data science. Expert-led training with hands-on projects." />
        <meta name="keywords" content="AI courses, machine learning training, artificial intelligence courses, data science courses, deep learning certification, neural networks training, AI bootcamp, ML engineering courses, AI career training, online AI education, professional AI courses" />
        <meta property="og:title" content="AI Courses & Machine Learning Training - ITwala Academy" />
        <meta property="og:description" content="Master AI with comprehensive courses in artificial intelligence, machine learning, and data science. Expert-led training with hands-on projects and industry certifications." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.it-wala.com/courses" />
        <meta property="og:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Courses & ML Training - ITwala Academy" />
        <meta name="twitter:description" content="Comprehensive AI and machine learning courses with expert instructors, hands-on projects, and industry certifications." />
        <meta name="twitter:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <link rel="canonical" href="https://academy.it-wala.com/courses" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "AI Courses & Machine Learning Training Programs",
            "description": "Comprehensive collection of AI and machine learning courses offered by ITwala Academy",
            "url": "https://academy.it-wala.com/courses",
            "mainEntity": {
              "@type": "ItemList",
              "name": "AI and Machine Learning Courses",
              "description": "Professional AI education and machine learning training programs",
              "numberOfItems": "20+",
              "itemListElement": [
                {
                  "@type": "Course",
                  "name": "AI & Machine Learning Fundamentals",
                  "description": "Master the fundamentals of artificial intelligence and machine learning",
                  "provider": "ITWala Academy",
                  "courseMode": "online",
                  "educationalLevel": "Beginner to Advanced"
                },
                {
                  "@type": "Course",
                  "name": "Data Science Professional Program",
                  "description": "Comprehensive data science training with real-world applications",
                  "provider": "ITWala Academy",
                  "courseMode": "online",
                  "educationalLevel": "Intermediate to Advanced"
                }
              ]
            },
            "provider": {
              "@type": "EducationalOrganization",
              "name": "ITWala Academy",
              "url": "https://academy.it-wala.com"
            }
          })}
        </script>
      </Head>

      <main>
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-11 pb-8 lg:pt-12 lg:pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mb-8"
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-10 bg-primary-500 shrink-0" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">AI &amp; Machine Learning · Expert-Led Training</span>
              </div>
              <h1 className="font-serif text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[1.06] text-gray-900 mb-5">
                AI Courses &amp;{' '}
                <span className="text-gradient">ML Training</span>
              </h1>
              <p className="text-[0.97rem] text-gray-500 leading-[1.85] max-w-[540px]">
                Master artificial intelligence and machine learning with expert-led courses, hands-on projects, and industry-recognized certifications.
              </p>
            </motion.div>

            <div className="max-w-2xl relative">
              <input
                type="text"
                placeholder="Search AI courses, machine learning, data science..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full py-3 px-4 sm:px-6 rounded-full bg-white shadow-md border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm sm:text-base"
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="py-2">
                    {suggestions.map((course, index) => (
                      <button
                        key={course.id || index}
                        onClick={() => {
                          setSearchQuery(course.title);
                          setDebouncedSearchQuery(course.title);
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-3 hover:bg-primary-50 transition-colors text-left flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{course.category}</span>
                            {course.level && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{course.level}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {!course.feesDiscussedPostEnrollment && suggestionPricing[course.id] && (
                          <div className="flex-shrink-0">
                            <span className="text-sm font-semibold text-primary-600">
                              {suggestionPricing[course.id].symbol}{(suggestionPricing[course.id].price / 100).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {suggestions.length === 5 && (
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                      <p className="text-xs text-gray-600 text-center">Press Enter to see all results</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Courses</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchCourses}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <CourseFilter
                  categories={categories}
                  levels={levels}
                  selectedCategory={selectedCategory}
                  selectedLevel={selectedLevel}
                  onCategoryChange={setSelectedCategory}
                  onLevelChange={setSelectedLevel}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  currencySymbol={SUPPORTED_COUNTRIES[userCountry]?.symbol ?? '₹'}
                />

                <div className="lg:col-span-3">
                  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <p className="text-gray-600 mb-2 sm:mb-0">
                        Showing <span className="font-semibold">{courses.length}</span> results
                        {selectedCategory && selectedCategory !== 'all' && (
                          <span className="text-primary-600 ml-2">
                            for category: &quot;{selectedCategory}&quot;
                          </span>
                        )}
                      </p>
                      <div className="flex items-center space-x-2">
                        <label htmlFor="sortOptions" className="text-gray-600">Sort by:</label>
                        <select
                          id="sortOptions"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="popular">Most Popular</option>
                          <option value="newest">Newest</option>
                          <option value="price-low">Registration Fee: Low to High</option>
                          <option value="price-high">Registration Fee: High to Low</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {courses.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
                      <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                  ) : (
                    <>
                      <CourseGrid courses={courses} />
                      {hasMore && (
                        <div className="mt-8 text-center">
                          <button
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="px-8 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {loadingMore ? 'Loading...' : 'Load More Courses'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <BacklinkingHub currentPage="course" currentCategory={selectedCategory} />
      </main>
    </>
  );
};

export default CoursesPage;
