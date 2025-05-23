import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LessonTypeIcon from './LessonTypeIcon';
import { LessonType } from '../../types/course';

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  isPreview?: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseContentProps {
  modules: Module[];
}

const CourseContent: React.FC<CourseContentProps> = ({ modules }) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(current => 
      current.includes(moduleId) 
        ? current.filter(id => id !== moduleId)
        : [...current, moduleId]
    );
  };

  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
      <div className="text-sm text-gray-600 mb-4">
        {modules.length} modules • {totalLessons} lessons
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg
                  className={`w-5 h-5 mr-2 transition-transform ${
                    expandedModules.includes(module.id) ? 'transform rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <h3 className="font-semibold text-gray-900">{module.title}</h3>
              </div>
              <span className="text-sm text-gray-500">
                {module.lessons.length} lessons
              </span>
            </button>

            <AnimatePresence>
              {expandedModules.includes(module.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-gray-200">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center flex-1">
                          <LessonTypeIcon type={lesson.type} />
                          <span className="text-gray-900">{lesson.title}</span>
                        </div>
                        <div className="flex items-center">
                          {lesson.isPreview && (
                            <span className="mr-4 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                              Preview
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;