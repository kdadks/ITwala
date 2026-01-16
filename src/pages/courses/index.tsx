import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CourseFilter from '@/components/courses/CourseFilter';
import CourseGrid from '../../components/courses/CourseGrid';
import BacklinkingHub from '@/components/seo/BacklinkingHub';
import { motion } from 'framer-motion';
import { Course } from '@/types/course';

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
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLevel !== 'all') params.append('level', selectedLevel);
      if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
      if (priceRange[1] < 50000) params.append('maxPrice', priceRange[1].toString());
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      params.append('sortBy', sortBy);

      console.log('🔍 fetchCourses called with:', {
        selectedCategory,
        selectedLevel,
        debouncedSearchQuery,
        sortBy,
        url: `/api/courses?${params.toString()}`
      });

      const response = await fetch(`/api/courses?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to load courses');
      }
      
      const data = await response.json();
      console.log('📦 API response:', {
        coursesCount: data.courses?.length || 0,
        courses: data.courses?.map(c => ({ id: c.id, title: c.title, category: c.category })) || []
      });
      setCourses(data.courses || []);
      
      // Extract unique categories and levels for filters
      if (data.courses && data.courses.length > 0) {
        const uniqueCategories = Array.from(new Set(data.courses.map((course: Course) => course.category))) as string[];
        const uniqueLevels = Array.from(new Set(data.courses.map((course: Course) => {
          return course.level.split(' to ').map(l => l.trim());
        }).flat())) as string[];
        
        setCategories(uniqueCategories);
        setLevels(uniqueLevels);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions for type-ahead (immediate, no debounce)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await fetch(`/api/courses?search=${encodeURIComponent(searchQuery)}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.courses || []);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 200); // Quick response for suggestions

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce search query for main results
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync URL params with filters - only run once when router is ready
  useEffect(() => {
    if (router.isReady) {
      console.log('🔄 URL params sync:', {
        routerQuery: router.query,
        currentStates: { selectedCategory, selectedLevel, searchQuery }
      });

      let hasChanges = false;

      if (typeof router.query.search === 'string' && router.query.search !== searchQuery) {
        setSearchQuery(router.query.search);
        setDebouncedSearchQuery(router.query.search);
        hasChanges = true;
      }
      if (typeof router.query.category === 'string' && router.query.category !== selectedCategory) {
        console.log('📝 Setting category from URL:', router.query.category);
        setSelectedCategory(router.query.category);
        hasChanges = true;
      }
      if (typeof router.query.level === 'string' && router.query.level !== selectedLevel) {
        setSelectedLevel(router.query.level);
        hasChanges = true;
      }

      if (hasChanges) {
        console.log('✅ URL params applied, filters will update');
      }
    }
  }, [router.isReady, router.query.search, router.query.category, router.query.level]);

  // Fetch courses when filters change (use debouncedSearchQuery instead of searchQuery)
  useEffect(() => {
    if (router.isReady) {
      fetchCourses();
    }
  }, [selectedCategory, selectedLevel, priceRange, sortBy, debouncedSearchQuery, router.isReady]);

  // Initial load to get all courses for filter options only
  useEffect(() => {
    const fetchAllCoursesForFilters = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const data = await response.json();
          if (data.courses && data.courses.length > 0) {
            const uniqueCategories = Array.from(new Set(data.courses.map((course: Course) => course.category))) as string[];
            const uniqueLevels = Array.from(new Set(data.courses.map((course: Course) => {
              return course.level.split(' to ').map(l => l.trim());
            }).flat())) as string[];

            setCategories(uniqueCategories);
            setLevels(uniqueLevels);

            console.log('📦 Initial load - filter options loaded:', {
              uniqueCategories,
              uniqueLevels,
              selectedCategory,
              hasUrlCategory: !!router.query.category
            });
          }
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };

    // Only run this on initial load when router is ready and we don't have categories yet
    if (router.isReady && categories.length === 0) {
      console.log('🎯 Fetching filter options...');
      fetchAllCoursesForFilters();
    }
  }, [router.isReady, categories.length]);

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
        
        {/* Schema for Courses Page */}
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
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 py-12 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 px-2">AI Courses & Machine Learning Training</h1>
              <p className="text-lg sm:text-xl text-primary-100 mb-6 md:mb-8 px-2">
                Master artificial intelligence and machine learning with expert-led courses, hands-on projects, and industry-recognized certifications.
              </p>
            </motion.div>

            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search AI courses, machine learning, data science..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full py-3 px-4 sm:px-6 rounded-full bg-white shadow-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm sm:text-base"
              />

              {/* Type-ahead suggestions dropdown */}
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
                        {course.price !== undefined && !course.feesDiscussedPostEnrollment && (
                          <div className="flex-shrink-0">
                            <span className="text-sm font-semibold text-primary-600">
                              ₹{course.price.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {suggestions.length === 5 && (
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                      <p className="text-xs text-gray-600 text-center">
                        Press Enter to see all results
                      </p>
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
                />
                
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <p className="text-gray-600 mb-2 sm:mb-0">
                        Showing <span className="font-semibold">{courses.length}</span> results
                        {selectedCategory && selectedCategory !== 'all' && (
                          <span className="text-primary-600 ml-2">
                            for category: "{selectedCategory}"
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
                    <CourseGrid courses={courses} />
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Internal Linking Hub */}
        <BacklinkingHub currentPage="course" currentCategory={selectedCategory} />
      </main>
    </>
  );
};

export default CoursesPage;