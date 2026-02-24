import { Course } from '@/types/course';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import RatingComponent from '../RatingComponent';
import { getCountryFromCookie, detectCountryFromIP, getCoursePrice, setCountryInCookie } from '@/utils/countryDetection';

interface CoursePricing {
  price: number;
  originalPrice: number | null;
  currency: string;
  symbol: string;
}

const RecommendedCourses = () => {
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCountry, setUserCountry] = useState<string>('IN');
  const [coursePricing, setCoursePricing] = useState<Record<string, CoursePricing>>({});

  useEffect(() => {
    const initCountry = async () => {
      let country = getCountryFromCookie();
      if (!country || country === 'IN') {
        country = await detectCountryFromIP();
        setCountryInCookie(country);
      }
      setUserCountry(country);
    };
    initCountry();
  }, []);

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch popular courses as recommendations
        const response = await fetch('/api/courses?sortBy=popular&limit=2');
        if (!response.ok) {
          throw new Error('Failed to load recommended courses');
        }

        const data = await response.json();
        setRecommendedCourses(data.courses || []);

        // Fetch pricing for each course
        const pricingPromises = (data.courses || []).map(async (course: Course) => {
          const pricing = await getCoursePrice(course.id, userCountry);
          return { courseId: course.id, pricing };
        });

        const pricingResults = await Promise.all(pricingPromises);
        const pricingMap: Record<string, CoursePricing> = {};
        pricingResults.forEach(({ courseId, pricing }) => {
          pricingMap[courseId] = pricing;
        });
        setCoursePricing(pricingMap);
      } catch (err) {
        console.error('Error fetching recommended courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    if (userCountry) {
      fetchRecommendedCourses();
    }
  }, [userCountry]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
      
      {error ? (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            Try Again
          </button>
        </div>
      ) : recommendedCourses.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No courses available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recommendedCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center p-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{course.title}</h3>
                    <div className="space-y-2">
                      <RatingComponent rating={course.rating || 0} />
                      <div className="flex justify-end">
                        {coursePricing[course.id] ? (
                          <div className="flex items-center gap-2">
                            {coursePricing[course.id].originalPrice && (
                              <span className="text-gray-400 line-through text-sm">
                                {coursePricing[course.id].symbol}{(coursePricing[course.id].originalPrice / 100).toLocaleString()}
                              </span>
                            )}
                            <span className="text-primary-600 font-semibold">
                              {coursePricing[course.id].symbol}{(coursePricing[course.id].price / 100).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-primary-600 font-semibold">
                            ₹{course.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <Link href="/courses">
        <div className="block text-center text-primary-600 hover:text-primary-700 mt-4">
          View All Courses →
        </div>
      </Link>
    </motion.div>
  );
};

export default RecommendedCourses;
