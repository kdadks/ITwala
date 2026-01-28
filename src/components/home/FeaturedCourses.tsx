import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Course } from '@/types/course';

const FeaturedCourses = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/courses?limit=10');

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const { courses } = await response.json();

        // Sort and get top 4
        const sorted = courses
          .sort((a: Course, b: Course) => {
            // First sort by new categories
            const isNewCategoryA = a.category === "Prompt Engineering" || a.category === "Agentic AI";
            const isNewCategoryB = b.category === "Prompt Engineering" || b.category === "Agentic AI";
            if (isNewCategoryA && !isNewCategoryB) return -1;
            if (!isNewCategoryA && isNewCategoryB) return 1;

            // Then sort by newest
            return new Date(b.publishedDate || "").getTime() - new Date(a.publishedDate || "").getTime();
          })
          .slice(0, 4);

        setFeaturedCourses(sorted);
      } catch (error) {
        console.error('Error fetching featured courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll speed multiplier
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  if (isLoading) {
    return (
      <section className="py-0 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-0 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-4">Featured Courses</h2>
          <Link href="/courses">
            <div className="text-primary-500 hover:text-primary-600 font-medium flex items-center text-sm sm:text-base">
              View All Courses
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </Link>
        </div>

        <div
          className="overflow-x-auto pb-6 no-scrollbar -mx-4 px-4"
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="flex space-x-4 md:space-x-6">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id || `featured-${index}`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 w-72 sm:w-80 md:w-1/3 lg:w-1/4"
                style={{ minWidth: '280px' }}
              >
                <Link href={`/courses/${course.slug}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                        priority={index < 2}
                      />
                      <div className="absolute top-4 right-4 bg-white py-1 px-2 rounded-full text-xs font-bold text-primary-500 z-10">
                        {course.level}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                          {course.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{course.description}</p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({course.reviews?.length || 0})</span>
                        </div>
                        <div className="flex justify-end">
                          <span className="text-lg font-bold text-primary-600">₹{course.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;