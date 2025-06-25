import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CourseFilter from '@/components/courses/CourseFilter';
import CourseGrid from '../../components/courses/CourseGrid';
import { motion } from 'framer-motion';
import { allCourses as courseData } from '@/data/allCourses';

const CoursesPage: NextPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync searchQuery with URL param
  useEffect(() => {
    if (typeof router.query.search === 'string') {
      setSearchQuery(router.query.search);
    }
  }, [router.query.search]);

  // Get unique categories from all courses
  const categories = Array.from(new Set(courseData.map(course => course.category)));
  // Get unique levels from all courses, handling compound levels like "Beginner to Advanced"
  const levels = Array.from(new Set(courseData.map(course => {
    // Split compound levels and flatten the array
    return course.level.split(' to ').map(l => l.trim());
  }).flat()));

  // Filter courses based on selected filters
  const filteredCourses = courseData.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || 
                        course.level === selectedLevel || 
                        course.level.split(' to ').includes(selectedLevel);
    const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLevel && matchesPrice && matchesSearch;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      case 'popular':
      default:
        return b.enrollments - a.enrollments;
    }
  });

  return (
    <>
      <Head>
        <title>Courses - ITwala Academy</title>
        <meta name="description" content="Browse our comprehensive collection of IT training courses in Product Management, Software Development, Testing, and AI." />
      </Head>

      <main>
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Explore Our Courses</h1>
              <p className="text-xl text-primary-100 mb-8">
                Discover specialized IT training designed to advance your career and skills.
              </p>
            </motion.div>
            
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-6 rounded-full bg-white shadow-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
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
                      Showing <span className="font-semibold">{sortedCourses.length}</span> results
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
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <CourseGrid courses={sortedCourses} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CoursesPage;