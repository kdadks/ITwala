import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [courseCount, setCourseCount] = useState<number | string>('8+');

  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const { courses } = await response.json();
          setCourseCount(`${courses.length}+`);
        }
      } catch (error) {
        console.error('Error fetching course count:', error);
        setCourseCount('8+');
      }
    };

    fetchCourseCount();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 text-white">
      {/* Abstract shapes background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-primary-900 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-secondary-800 opacity-10 blur-3xl"></div>
      </div>

      {/* Floating elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <div className="absolute top-20 left-10 w-12 h-12 bg-white rounded-lg opacity-10 transform rotate-12"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-accent-200 rounded-full opacity-10"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-secondary-200 rounded-lg opacity-10 transform -rotate-12"></div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 md:py-10 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-4 md:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight text-white drop-shadow-lg">
              Transform Your Future with IT Excellence
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 drop-shadow">
              IT- It's Simple| Let us shape your career & business
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-4 md:mb-6 max-w-2xl mx-auto px-2 drop-shadow">
              Master cutting-edge technologies with industry experts and hands-on projects. Accelerate your business with our proven consulting solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-6 md:mb-8 px-2"
          >
            <Link href="/courses">
              <div className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-7 py-2 text-sm sm:text-base font-semibold bg-white text-primary-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-200 focus:ring-offset-primary-900">
                Get Started
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
            <Link href="/courses">
              <div className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-7 py-2 text-sm sm:text-base font-semibold border-2 border-white text-white rounded-full bg-transparent hover:bg-white hover:text-primary-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-200 focus:ring-offset-primary-900">
                Browse Courses
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="px-2"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">500+</div>
                <div className="text-xs sm:text-sm text-gray-200">Students Enrolled</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">{courseCount}</div>
                <div className="text-xs sm:text-sm text-gray-200">Specialized Courses</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">20+</div>
                <div className="text-xs sm:text-sm text-gray-200">Learning Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">80%</div>
                <div className="text-xs sm:text-sm text-gray-200">Job Placement</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">20+</div>
                <div className="text-xs sm:text-sm text-gray-200">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">98%</div>
                <div className="text-xs sm:text-sm text-gray-200">Client Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;