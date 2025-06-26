import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Course } from '../../types/course';
import RatingComponent from '../RatingComponent';

interface CourseGridProps {
  courses: Course[];
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <Link href={`/courses/${course.slug}`}>
            <div className="block h-full">
              <div className="relative h-40 sm:h-48">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-white py-1 px-2 rounded-full text-xs font-bold text-primary-500 shadow-sm">
                  {course.level}
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                    {course.category}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <RatingComponent rating={course.rating || 0} />
                    <span className="text-xs sm:text-sm text-gray-500 ml-2">
                      ({course.reviews?.length || 0})
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-primary-600">
                    ₹{course.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseGrid;