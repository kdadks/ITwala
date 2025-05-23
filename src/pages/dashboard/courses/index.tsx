import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface EnrolledCourse {
  id: string;
  course: {
    id: string;
    title: string;
    description: string;
    image: string;
    slug: string;
  };
  progress: number;
  enrolled_at: string;
  status: 'active' | 'completed' | 'paused';
}

const MyCoursesPage: NextPage = () => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const supabase = useSupabaseClient();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            id,
            enrolled_at,
            status,
            course:courses (
              id,
              title,
              description,
              image,
              slug
            ),
            progress
          `)
          .eq('user_id', user?.id)
          .order('enrolled_at', { ascending: false });

        if (error) throw error;

        // Transform the data to match the EnrolledCourse type
        const transformedData: EnrolledCourse[] = (data || []).map(item => ({
          id: item.id,
          enrolled_at: item.enrolled_at,
          status: item.status as 'active' | 'completed' | 'paused',
          progress: item.progress,
          course: Array.isArray(item.course) ? item.course[0] : item.course
        }));

        setEnrolledCourses(transformedData);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        toast.error('Failed to load your courses');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user, supabase]);

  if (!user || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Courses - ITwala Academy</title>
        <meta name="description" content="Access your enrolled courses and continue your learning journey." />
      </Head>

      <main className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Courses</h1>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((enrollment) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    <Link href={`/dashboard/course/${enrollment.course.slug}`} className="block">
                      <div className="relative h-48">
                        <Image
                          src={enrollment.course.image}
                          alt={enrollment.course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">{enrollment.course.title}</h3>
                          <span
                            className={`text-sm px-3 py-1 rounded-full ${
                              enrollment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : enrollment.status === 'active'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {enrollment.course.description}
                        </p>
                        <div className="mt-4">
                          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                            <span>Progress</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-900 mb-4">You haven't enrolled in any courses yet</h2>
                <p className="text-gray-600 mb-8">Browse our courses and start your learning journey today!</p>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default MyCoursesPage;
