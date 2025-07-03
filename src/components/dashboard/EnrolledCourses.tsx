import { Course } from '@/types/course';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';

const EnrolledCourses = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch enrolled courses from database
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('enrollments')
          .select(`
            id,
            enrolled_at,
            progress,
            status,
            course:courses(
              id,
              slug,
              title,
              description,
              category,
              image,
              level,
              duration,
              price,
              instructor
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('enrolled_at', { ascending: false });

        if (enrollmentError) {
          throw enrollmentError;
        }

        // Transform the data to match Course interface
        const transformedCourses = enrollments?.map((enrollment: any) => ({
          ...enrollment.course,
          enrollmentId: enrollment.id,
          enrolledAt: enrollment.enrolled_at,
          progress: enrollment.progress || 0,
          status: enrollment.status
        })) || [];

        setEnrolledCourses(transformedCourses);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching enrolled courses:', err);
        setError(err.message || 'Failed to load enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user, supabase]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Enrolled Courses</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Enrolled Courses</h2>
      
      {error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : enrolledCourses.length === 0 ? (
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
          {enrolledCourses.map((course: any) => (
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
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.category}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
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
