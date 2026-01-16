import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const UnifiedHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 text-white">
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

      <div className="container mx-auto px-4 py-4 md:py-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-4 md:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-3">
              <Image src="/images/IT-WALA-logo-64x64.png" alt="IT Wala Logo" width={64} height={64} className="object-contain drop-shadow-lg rounded-2xl" priority />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 leading-tight text-white drop-shadow-lg">
              ITWala - Your Complete IT Partner
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1 drop-shadow">
              IT- It's Simple | Let us shape your career & business
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-100 mb-3 md:mb-4 max-w-2xl mx-auto px-2 drop-shadow">
              Empowering individuals through world-class education and transforming businesses with expert consulting solutions. Your journey to IT excellence starts here.
            </p>
          </motion.div>

          {/* Dual Service Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-3 mb-4 md:mb-6"
          >
            {/* Academy Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-accent-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-white">ITWala Academy</h3>
              <p className="text-gray-100 mb-2 text-xs md:text-sm">
                Master cutting-edge technologies with industry experts and hands-on projects. Build your career with our comprehensive courses.
              </p>
              <div className="flex flex-wrap gap-1 mb-2 justify-center">
                <span className="px-2 py-0.5 bg-accent-200/20 text-accent-100 rounded-full text-xs">500+ Students</span>
                <span className="px-2 py-0.5 bg-accent-200/20 text-accent-100 rounded-full text-xs">7+ Courses</span>
                <span className="px-2 py-0.5 bg-accent-200/20 text-accent-100 rounded-full text-xs">80% Job Placement</span>
                <span className="px-2 py-0.5 bg-accent-200/20 text-accent-100 rounded-full text-xs">20+ Learning Tracks</span>
              </div>
              <Link href="/academy">
                <div className="inline-flex items-center justify-center w-full px-4 py-2 text-xs font-semibold bg-accent-200 text-primary-700 rounded-full hover:bg-accent-100 transition-all duration-300 transform hover:-translate-y-0.5">
                  Explore Academy
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* Consulting Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-accent-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-white">ITWala Consulting</h3>
              <p className="text-gray-100 mb-2 text-xs md:text-sm">
                Transform your business with expert IT solutions. From strategy to implementation, we deliver results that drive growth.
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="px-2 py-0.5 bg-accent-200/20 text-accent-100 rounded-full text-xs">100+ Projects</span>
                <span className="px-2 py-0.5 bg-accent-200/20 text-accent-100 rounded-full text-xs">50+ Consultants</span>
                <span className="px-2 py-0.5 bg-accent-200/20 text-accent-100 rounded-full text-xs">24/7 Support</span>
                <span className="px-2 py-0.5 bg-accent-200/20 text-accent-100 rounded-full text-xs">98% Customer Satisfaction</span>
              </div>
              <Link href="/consulting">
                <div className="inline-flex items-center justify-center w-full px-4 py-2 text-xs font-semibold bg-white text-primary-700 rounded-full hover:bg-primary-100 transition-all duration-300 transform hover:-translate-y-0.5">
                  Explore Consulting
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 px-2"
          >
            <Link href="/contact">
              <div className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-2 text-xs sm:text-sm font-semibold border-2 border-white text-white rounded-full bg-transparent hover:bg-white hover:text-primary-700 transition-all duration-300 transform hover:-translate-y-0.5">
                Get Free Consultation
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </Link>
            <Link href="/about">
              <div className="w-full sm:w-auto inline-flex items-center justify-center px-5 sm:px-6 py-2 text-xs sm:text-sm font-semibold border-2 border-accent-200 text-accent-200 rounded-full bg-transparent hover:bg-accent-200 hover:text-primary-700 transition-all duration-300 transform hover:-translate-y-0.5">
                Learn About Us
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedHero;