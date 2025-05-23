import type { Module } from '@/types/course';
import { motion } from 'framer-motion';
import LessonTypeIcon from '../courses/LessonTypeIcon';

interface CourseNavigationProps {
  modules: Module[];
  currentModule: number;
  currentLesson: number;
  progress: Record<string, boolean>;
  onLessonSelect: (moduleIndex: number, lessonIndex: number) => void;
}

const CourseNavigation: React.FC<CourseNavigationProps> = ({
  modules,
  currentModule,
  currentLesson,
  progress,
  onLessonSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h2>
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <div key={module.id} className="border rounded-lg">
            <div className="p-4 bg-gray-50">
              <h3 className="font-medium text-gray-900">{module.title}</h3>
              <p className="text-sm text-gray-500">{module.lessons.length} lessons</p>
            </div>
            <div className="divide-y">
              {module.lessons.map((lesson, lessonIndex) => {
                const isCompleted = progress[`${moduleIndex}-${lessonIndex}`];
                const isActive = moduleIndex === currentModule && lessonIndex === currentLesson;

                return (
                  <motion.button
                    key={lesson.id}
                    whileHover={{ x: 4 }}
                    onClick={() => onLessonSelect(moduleIndex, lessonIndex)}
                    className={`w-full flex items-center p-3 text-left ${
                      isActive ? 'bg-primary-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div className="mr-3">
                        <LessonTypeIcon type={lesson.type} />
                      </div>
                      <div>
                        <p className={`text-sm ${isActive ? 'text-primary-600 font-medium' : 'text-gray-900'}`}>
                          {lesson.title}
                        </p>
                      </div>
                    </div>
                    {isCompleted && (
                      <svg
                        className="w-5 h-5 text-green-500 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseNavigation;
