import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CourseFilter from '@/components/courses/CourseFilter';
import CourseGrid from '../../components/courses/CourseGrid';
import { motion } from 'framer-motion';
import { Course } from '@/types/course';

const CoursesPage: NextPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);

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
      if (searchQuery) params.append('search', searchQuery);
      params.append('sortBy', sortBy);

      console.log('🔍 fetchCourses called with:', {
        selectedCategory,
        selectedLevel,
        searchQuery,
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

  // Sync URL params with filters
  useEffect(() => {
    if (router.isReady) {
      console.log('🔄 URL params sync:', {
        routerQuery: router.query,
        currentStates: { selectedCategory, selectedLevel, searchQuery }
      });
      
      if (typeof router.query.search === 'string') {
        setSearchQuery(router.query.search);
      }
      if (typeof router.query.category === 'string') {
        console.log('📝 Setting category from URL:', router.query.category);
        setSelectedCategory(router.query.category);
      }
      if (typeof router.query.level === 'string') {
        setSelectedLevel(router.query.level);
      }
    }
  }, [router.isReady, router.query.search, router.query.category, router.query.level]);

  // Fetch courses when filters change
  useEffect(() => {
    if (router.isReady) {
      fetchCourses();
    }
  }, [selectedCategory, selectedLevel, priceRange, sortBy, searchQuery, router.isReady]);

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
            
            // Only set courses if no specific filtering is applied (i.e., showing all courses)
            if (selectedCategory === 'all' && selectedLevel === 'all' && !searchQuery) {
              setCourses(data.courses || []);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    
    // Only run this on initial load when router is ready and we don't have categories yet
    if (router.isReady && categories.length === 0) {
      fetchAllCoursesForFilters();
    }
  }, [router.isReady, categories.length, selectedCategory, selectedLevel, searchQuery]);

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
        <title>AI Courses & Machine Learning Training - ITwala Academy | Best AI Education Platform</title>
        <meta name="description" content="Explore ITwala Academy's comprehensive AI courses and machine learning training programs. Master artificial intelligence, data science, deep learning with expert instructors. Industry-recognized AI certifications, hands-on projects, career support." />
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
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-12 md:py-24">
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
            
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search AI courses, machine learning, data science..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 sm:px-6 rounded-full bg-white shadow-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm sm:text-base"
              />
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
      </main>
    </>
  );
};

export default CoursesPage;