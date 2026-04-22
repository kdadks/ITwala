import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ConsultingHero = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Mesh gradient backdrop */}
      <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />
      {/* Vertical accent rule (desktop) */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-11 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: content + CTAs */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-10 bg-primary-500 shrink-0" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">
                  IT Consulting · Digital Transformation
                </span>
              </div>
              <h1 className="font-serif text-[2.6rem] sm:text-[3.2rem] lg:text-[3.8rem] leading-[1.06] text-gray-900 mb-5">
                ITWala Product &amp;{' '}
                <span className="text-gradient">Consulting</span>
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-[3px] h-9 bg-accent-500 rounded-full shrink-0" />
                <p className="text-[1.05rem] text-gray-600 font-medium leading-snug">
                  Transform Your Business
                  <span className="text-gray-400 font-normal"> · Expert IT Solutions</span>
                </p>
              </div>
              <p className="text-[0.94rem] text-gray-500 leading-[1.85] mb-10">
                From strategic planning to implementation, we deliver comprehensive IT solutions that drive growth, innovation, and digital transformation for businesses of all sizes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-2 sm:gap-3"
            >
              <a href="#services">
                <div className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold bg-white text-primary-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-200 whitespace-nowrap">
                  Services
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </a>
              <a href="#why-choose-us">
                <div className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold bg-secondary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-200 whitespace-nowrap">
                  Why Us
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </a>
              <Link href="/portfolio">
                <div className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold bg-accent-200 text-primary-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-accent-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-200 whitespace-nowrap">
                  Portfolio
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </Link>
              <a href="#process">
                <div className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold bg-primary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-200 whitespace-nowrap">
                  Process
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </motion.div>
          </div>

          {/* Right: stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-4 sm:gap-6 text-xs md:text-sm"
          >
            {[
              { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", label: "20+ Projects Delivered" },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", label: "50+ Expert Consultants" },
              { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z", label: "25+ Countries Served" },
              { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "98% Client Satisfaction" },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "10+ Years Experience" },
              { icon: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6V11m0-5.5v-1a1.5 1.5 0 00-3 0v1.5m9 0V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6V11m0-5.5v-1a1.5 1.5 0 00-3 0v1.5", label: "95% Client Retention" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                <svg className="w-5 h-5 shrink-0 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
                <span className="font-medium text-gray-700">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConsultingHero;