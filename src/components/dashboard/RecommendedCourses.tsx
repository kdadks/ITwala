import { Course } from '@/types/course';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { allCourses } from '@/data/allCourses';
import RatingComponent from '../RatingComponent';

const RecommendedCourses = () => {
  // In a real app, this would be personalized based on user's interests and behavior
  const recommendedCourses = allCourses.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
      
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                  <div className="flex items-center justify-between">
                    <RatingComponent rating={course.rating || 0} />
                    <span className="text-primary-600 font-semibold">
                      ₹{course.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <Link href="/courses">
        <div className="block text-center text-primary-600 hover:text-primary-700 mt-4">
          View All Courses →
        </div>
      </Link>
    </motion.div>
  );
};

export default RecommendedCourses;
