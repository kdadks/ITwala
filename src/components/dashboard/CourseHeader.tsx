import { Course } from '@/types/course';
import { motion } from 'framer-motion';

interface CourseHeaderProps {
  course: Course;
  progress: Record<string, boolean>;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ course, progress }) => {
  // Calculate progress percentage
  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );
  
  const completedLessons = Object.values(progress).filter(Boolean).length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
          <div className="flex items-center text-primary-100 mb-6">
            <span className="mr-4">
              {course.modules.length} Modules • {totalLessons} Lessons
            </span>
            <span>•</span>
            <span className="mx-4">Level: {course.level}</span>
          </div>

          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Your Progress</span>
              <span className="text-primary-100">{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-white h-2 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseHeader;
