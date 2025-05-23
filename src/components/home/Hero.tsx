import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
      {/* Abstract shapes background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-secondary-500 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-accent-500 opacity-20 blur-3xl"></div>
      </div>

      {/* Floating elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <div className="absolute top-20 left-10 w-12 h-12 bg-white rounded-lg opacity-10 transform rotate-12"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-accent-400 rounded-full opacity-10"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-secondary-300 rounded-lg opacity-10 transform -rotate-12"></div>
      </motion.div>

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-100">
              Transform Your Future with IT Excellence
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Master cutting-edge technologies with industry experts and hands-on projects
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <Link href="/courses">
              <div className="inline-flex items-center px-8 py-3 text-lg font-semibold bg-white text-primary-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-primary-600">
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
            <Link href="/courses">
              <div className="inline-flex items-center px-8 py-3 text-lg font-semibold border-2 border-white text-white rounded-full hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-primary-600">
                Browse Courses
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center space-x-8 text-sm md:text-base"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>500+ Students</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>7+ Courses</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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