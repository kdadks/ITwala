import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-24 md:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Innovate today for better tomorrow
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-lg">
              Specialized IT training designed to advance your career. Learn from industry professionals with real-world experience.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/courses">
                <div className="bg-white text-primary-600 hover:bg-gray-100 py-3 px-6 rounded-md font-semibold shadow-lg transition-colors text-center">
                  Explore Courses
                </div>
              </Link>
              <Link href="/contact">
                <div className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 py-3 px-6 rounded-md font-semibold transition-colors text-center">
                  Contact Us
                </div>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              <div className="relative bg-white p-6 rounded-lg shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Course</h3>
                <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden mb-4">
                  <img 
                    src="https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="AI Course" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">AI & Machine Learning Fundamentals</h4>
                <p className="text-gray-600 text-sm mb-4">Master the fundamentals of AI and machine learning with hands-on projects</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    </div>
                    <span className="text-gray-600 text-sm ml-1">(128)</span>
                  </div>
                  <span className="text-primary-600 font-bold">₹3,999</span>
                </div>
                <Link href="/courses/ai-machine-learning-fundamentals">
                  <div className="block bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded font-medium text-center transition-colors">
                    View Course
                  </div>
                </Link>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-500 rounded-lg -z-10 opacity-70"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary-500 rounded-lg -z-10 opacity-70"></div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 pt-10 border-t border-primary-400 border-opacity-30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center md:items-start"
            >
              <div className="text-3xl lg:text-4xl font-bold mb-2">20+</div>
              <div className="text-primary-200">Industry Partners</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center md:items-start"
            >
              <div className="text-3xl lg:text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-200">Specialized Courses</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col items-center md:items-start"
            >
              <div className="text-3xl lg:text-4xl font-bold mb-2">5000+</div>
              <div className="text-primary-200">Successful Students</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col items-center md:items-start"
            >
              <div className="text-3xl lg:text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-200">Satisfaction Rate</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;