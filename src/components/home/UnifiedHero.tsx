import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const UnifiedHero = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Mesh gradient backdrop */}
      <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />

      {/* Vertical accent rule on left edge (desktop only) */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-11 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 lg:gap-20 items-center">

          {/* ── Left: content ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            {/* Logo + eyebrow */}
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="/images/IT-WALA-logo-64x64.png"
                alt="IT Wala Logo"
                width={48}
                height={48}
                className="object-contain rounded-xl"
                priority
              />
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-primary-500 shrink-0" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">
                  Education &amp; Consulting · IT Excellence
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-[2.6rem] sm:text-[3.2rem] lg:text-[3.8rem] leading-[1.06] text-gray-900 mb-5">
              Your Complete{' '}
              <span className="text-gradient">IT Partner</span>
            </h1>

            {/* Sub-tagline */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[3px] h-9 bg-accent-500 rounded-full shrink-0" />
              <p className="text-[1.05rem] text-gray-600 font-medium leading-snug">
                IT — It&apos;s Simple
                <span className="text-gray-400 font-normal"> · Let us shape your career &amp; business</span>
              </p>
            </div>

            <p className="text-[0.94rem] text-gray-500 leading-[1.85] max-w-[520px] mb-10">
              Empowering individuals through world-class education and transforming businesses with expert consulting solutions. Your journey to IT excellence starts here.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/contact">
                <span className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white h-12 px-7 rounded-lg font-semibold text-sm shadow-md shadow-primary-500/20 transition-all duration-200">
                  Get Free Consultation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </Link>
              <Link href="/about">
                <span className="inline-flex items-center gap-1.5 h-12 px-5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm font-medium transition-all duration-200">
                  Learn About Us →
                </span>
              </Link>
            </div>
          </motion.div>

          {/* ── Right: service cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
            className="flex flex-col gap-4"
          >
            {/* Academy card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-primary-200 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900">ITWala Academy</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Master cutting-edge technologies with industry experts and hands-on projects. Build your career with our comprehensive courses.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['500+ Students', '8+ Courses', '80% Job Placement', '20+ Tracks'].map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 bg-primary-50 text-primary-600 rounded-full text-[11px] font-medium">{tag}</span>
                ))}
              </div>
              <Link href="/academy">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">
                  Explore Academy
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Consulting card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-accent-300 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-500 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900">ITWala Consulting</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Transform your business with expert IT solutions. From strategy to implementation, we deliver results that drive growth.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['20+ Projects', '50+ Consultants', '24/7 Support', '98% Satisfaction'].map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 bg-accent-50 text-accent-600 rounded-full text-[11px] font-medium">{tag}</span>
                ))}
              </div>
              <Link href="/consulting">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-500 hover:text-accent-600 transition-colors">
                  Explore Consulting
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default UnifiedHero;
