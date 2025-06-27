import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero = () => {
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

      <div className="container mx-auto px-4 py-8 md:py-14 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <Image src="/images/IT - WALA_logo (1).png" alt="IT Wala Logo" width={90} height={90} className="object-contain drop-shadow-lg" priority />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight text-white drop-shadow-lg">
              Transform Your Future with IT Excellence
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1 drop-shadow">
              IT- Simple Hain | Let us shape your career
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-4 md:mb-6 max-w-2xl mx-auto px-2 drop-shadow">
              Master cutting-edge technologies with industry experts and hands-on projects
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
            <Link href="/consulting">
              <div className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-7 py-2 text-sm sm:text-base font-semibold border-2 border-accent-200 text-accent-200 rounded-full bg-transparent hover:bg-accent-200 hover:text-primary-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-200 focus:ring-offset-primary-900">
                Browse Consulting
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
            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-xs md:text-sm px-2"
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>500+ Students</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>7+ Courses</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>100% Job Ready</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;