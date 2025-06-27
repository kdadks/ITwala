import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ConsultingHero = () => {
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

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <Image 
                src="/images/IT - WALA_logo (1).png" 
                alt="ITWala Logo" 
                width={100} 
                height={100} 
                className="object-contain drop-shadow-lg" 
                priority 
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight text-white drop-shadow-lg">
              ITWala Product & Consulting
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 drop-shadow">
              Transform Your Business with Expert IT Solutions
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 md:mb-8 max-w-3xl mx-auto px-2 drop-shadow">
              From strategic planning to implementation, we deliver comprehensive IT solutions that drive growth, innovation, and digital transformation for businesses of all sizes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 md:mb-12 px-2"
          >
            <Link href="#services">
              <div className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold bg-white text-primary-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-200 focus:ring-offset-primary-900">
                Explore Our Services
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
            <Link href="/contact">
              <div className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold border-2 border-white text-white rounded-full bg-transparent hover:bg-white hover:text-primary-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-200 focus:ring-offset-primary-900">
                Get Free Consultation
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs md:text-sm px-2"
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>100+ Successful Projects</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>50+ Expert Consultants</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-accent-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConsultingHero;