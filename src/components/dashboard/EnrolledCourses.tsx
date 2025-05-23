import { Course } from '@/types/course';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const EnrolledCourses = () => {
  // In a real app, fetch user's enrolled courses from the backend
  const mockEnrolledCourses = [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Enrolled Courses</h2>
      
      {mockEnrolledCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
          <Link 
            href="/courses"
            className="inline-block bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockEnrolledCourses.map((course: Course) => (
            <Link key={course.id} href={`/dashboard/course/${course.slug}`}>
              <div className="flex items-start space-x-4 p-4 rounded-lg border hover:border-primary-500 transition-colors">
                <div className="flex-shrink-0 w-24 h-16 relative rounded-md overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EnrolledCourses;
