import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Course } from '../../types/course';
import RatingComponent from '../RatingComponent';

interface RelatedCoursesProps {
  courses: Course[];
}

const RelatedCourses: React.FC<RelatedCoursesProps> = ({ courses }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Courses</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/courses/${course.slug}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="relative h-48">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition duration-150 ease-in-out">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{course.level}</p>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <RatingComponent rating={course.rating || 0} />
                        <span className="text-sm text-gray-500">
                          ({course.reviews?.length || 0})
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        ₹{course.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedCourses;