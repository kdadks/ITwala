import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Course } from '@/types/course';
import CourseHeader from '@/components/dashboard/CourseHeader';
import CourseNavigation from '@/components/dashboard/CourseNavigation';
import CourseContent from '@/components/dashboard/CourseContent';
import { hydrateModuleIds } from '@/utils/moduleHelper';

interface CoursePageProps {
  course: Course;
}

const CoursePage: NextPage<CoursePageProps> = ({ course }) => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch actual progress from database
        const { data: progressData, error } = await supabase
          .from('progress')
          .select('lesson_id, completed, class_number')
          .eq('user_id', user.id)
          .eq('course_id', course.id);

        if (error) {
          console.error('Error fetching progress:', error);
          setProgress({});
          setIsLoading(false);
          return;
        }

        // Transform database progress to the format expected by the UI
        const progressMap: Record<string, boolean> = {};

        if (progressData && progressData.length > 0) {
          course.modules.forEach((module: any, mIndex: number) => {
            module.lessons.forEach((lesson: any, lIndex: number) => {
              const key = `${mIndex}-${lIndex}`;
              // Check if this lesson is completed in the database
              const lessonProgress = progressData.find(
                p => p.lesson_id === lesson.id || p.class_number === (lIndex + 1)
              );
              progressMap[key] = lessonProgress?.completed || false;
            });
          });
        }

        setProgress(progressMap);
      } catch (error) {
        console.error('Error loading progress:', error);
        setProgress({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [course, user]);

  const markLessonComplete = async (moduleIndex: number, lessonIndex: number) => {
    const key = `${moduleIndex}-${lessonIndex}`;
    const lesson = course.modules[moduleIndex]?.lessons[lessonIndex];

    if (!lesson || !user) return;

    try {
      // Update progress in database
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          course_id: course.id,
          lesson_id: lesson.id,
          class_number: lessonIndex + 1,
          completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      if (error) {
        console.error('Error marking lesson complete:', error);
        return;
      }

      // Update local state
      setProgress((prev) => ({
        ...prev,
        [key]: true,
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleLessonSelect = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-center">Course not found</h1>
      </div>
    );
  }

  const currentLessonData = course.modules[currentModule].lessons[currentLesson];

  return (
    <>
      <Head>
        <title>{course.title} - ITwala Academy</title>
        <meta name="description" content={`Learn ${course.title} on ITwala Academy.`} />
      </Head>

      <main className="bg-gray-100 min-h-screen">
        <CourseHeader 
          course={course} 
          progress={progress}
        />
        
        <div className="container mx-auto px-4 pt-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="sticky top-24"
              >
                <CourseNavigation 
                  modules={course.modules} 
                  currentModule={currentModule}
                  currentLesson={currentLesson}
                  progress={progress}
                  onLessonSelect={handleLessonSelect}
                />
              </motion.div>
            </div>
            
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <CourseContent 
                  lesson={currentLessonData}
                  moduleIndex={currentModule}
                  lessonIndex={currentLesson}
                  isCompleted={progress[`${currentModule}-${currentLesson}`] || false}
                  onComplete={markLessonComplete}
                  onNext={() => {
                    // Navigate to next lesson or module
                    if (currentLesson < course.modules[currentModule].lessons.length - 1) {
                      setCurrentLesson(currentLesson + 1);
                    } else if (currentModule < course.modules.length - 1) {
                      setCurrentModule(currentModule + 1);
                      setCurrentLesson(0);
                    }
                  }}
                  onPrevious={() => {
                    // Navigate to previous lesson or module
                    if (currentLesson > 0) {
                      setCurrentLesson(currentLesson - 1);
                    } else if (currentModule > 0) {
                      setCurrentModule(currentModule - 1);
                      setCurrentLesson(course.modules[currentModule - 1].lessons.length - 1);
                    }
                  }}
                  hasNext={
                    currentLesson < course.modules[currentModule].lessons.length - 1 ||
                    currentModule < course.modules.length - 1
                  }
                  hasPrevious={
                    currentLesson > 0 ||
                    currentModule > 0
                  }
                />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = context.req.headers.host || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/courses/${slug}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return {
        notFound: true,
      };
    }

    const { course } = await response.json();

    // Hydrate module IDs
    const hydratedCourse = hydrateModuleIds(course);

    return {
      props: {
        course: hydratedCourse,
      },
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    return {
      notFound: true,
    };
  }
};

export default CoursePage;