import { Lesson } from '@/types/course';
import { motion } from 'framer-motion';
import React from 'react';

interface CourseContentProps {
  lesson: Lesson;
  moduleIndex: number;
  lessonIndex: number;
  isCompleted: boolean;
  onComplete: (moduleIndex: number, lessonIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const CourseContent: React.FC<CourseContentProps> = ({
  lesson,
  moduleIndex,
  lessonIndex,
  isCompleted,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        key={`${moduleIndex}-${lessonIndex}`}
        className="p-6"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{lesson.title}</h2>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="uppercase bg-primary-100 text-primary-800 px-2 py-1 rounded">
              {lesson.type}
            </span>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            {lesson.content}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`px-4 py-2 rounded-md ${
              hasPrevious
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            Previous
          </button>

          <div className="flex items-center space-x-4">
            {!isCompleted && (
              <button
                onClick={() => onComplete(moduleIndex, lessonIndex)}
                className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Mark as Complete
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Next Lesson
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseContent;
