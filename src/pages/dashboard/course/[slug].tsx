import { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { allCourses as courseData } from '@/data/allCourses';
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // In a real app, you would fetch the user's progress from your database
    // This is just mock data for demonstration
    const mockProgress: Record<string, boolean> = {};
    let totalLessons = 0;
    let completed = 0;
    
    course.modules.forEach((module: any, mIndex: number) => {
      module.lessons.forEach((lesson: any, lIndex: number) => {
        const key = `${mIndex}-${lIndex}`;
        totalLessons++;
        // Randomly mark some lessons as completed for demo purposes
        const isCompleted = Math.random() > 0.6;
        mockProgress[key] = isCompleted;
        if (isCompleted) completed++;
      });
    });
    
    setProgress(mockProgress);
    setIsLoading(false);
  }, [course]);

  const markLessonComplete = (moduleIndex: number, lessonIndex: number) => {
    const key = `${moduleIndex}-${lessonIndex}`;
    setProgress((prev) => ({
      ...prev,
      [key]: true,
    }));
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  // In a real app, you would fetch this data from your API or CMS
  const course = courseData.find((course) => course.slug === slug);
  
  if (!course) {
    return {
      notFound: true,
    };
  }

  // Hydrate the course data with module IDs
  const hydratedCourse = hydrateModuleIds(course);

  return {
    props: {
      course: hydratedCourse,
    },
  };
};

export default CoursePage;