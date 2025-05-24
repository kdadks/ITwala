import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Course {
  title: string;
  description: string;
  level: string;
  price: number;
  image: string;
}

interface CourseBannerProps {
  course: Course;
  onEnroll: () => void;
  enrollmentsEnabled?: boolean;
}

const CourseBanner: React.FC<CourseBannerProps> = ({ 
  course, 
  onEnroll,
  enrollmentsEnabled = true 
}) => {
  return (
    <div className="relative bg-gray-900 py-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {course.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {course.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-gray-400 text-sm">Level</p>
              <p className="text-white font-medium">{course.level}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Price</p>
              <p className="text-white font-medium">₹{course.price.toLocaleString()}</p>
            </div>
          </div>

          <button
            onClick={onEnroll}
            className={`px-8 py-3 rounded-lg font-medium transition-colors duration-200 ${
              enrollmentsEnabled 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-gray-400 cursor-not-allowed text-gray-100'
            }`}
            disabled={!enrollmentsEnabled}
          >
            {enrollmentsEnabled ? 'Enroll Now' : 'Enrollment Disabled'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseBanner;