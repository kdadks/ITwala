import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const stats = [
  { value: '500+',  label: 'Students Enrolled' },
  { value: '98%',   label: 'Satisfaction Rate'  },
  { value: '8+',   label: 'Batches Delivered' },
];

const Hero = () => {
  const [courseCount, setCourseCount] = useState<string>('8+');

  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const response = await fetch('/api/courses');
        if (response.ok) {
          const { courses } = await response.json();
          setCourseCount(`${courses.length}+`);
        }
      } catch {
        setCourseCount('8+');
      }
    };
    fetchCourseCount();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Mesh gradient backdrop — subtle radial washes */}
      <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />

      {/* Vertical accent rule on left edge (desktop only) */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-11 pb-10 lg:pt-14 lg:pb-12 w-full">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">

          {/* ── Left: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-primary-500 shrink-0" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">
                AI &amp; Web Technology · Education &amp; Consulting
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-[2.6rem] sm:text-[3.2rem] lg:text-[3.8rem] leading-[1.06] text-gray-900 mb-5">
              Transform Your Future with{' '}
              <span className="text-gradient">IT Excellence</span>
            </h1>

            {/* Sub-tagline with left accent bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[3px] h-9 bg-accent-500 rounded-full shrink-0" />
              <p className="text-[1.05rem] text-gray-600 font-medium leading-snug">
                IT — It&apos;s Simple
                <span className="text-gray-400 font-normal"> · Let us shape your career &amp; business</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-[0.94rem] text-gray-500 leading-[1.85] max-w-[480px] mb-10">
              Master cutting-edge technologies with industry experts and hands-on projects.
              Accelerate your business with our proven consulting solutions.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/courses">
                <span className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white h-12 px-7 rounded-lg font-semibold text-sm shadow-md shadow-primary-500/20 transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Get Started
                </span>
              </Link>
              <Link href="/courses">
                <span className="inline-flex items-center gap-1.5 h-12 px-5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm font-medium transition-all duration-200">
                  Explore Courses →
                </span>
              </Link>
            </div>
          </motion.div>

          {/* ── Right: Stats ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
            className="grid grid-cols-2 gap-4 lg:gap-5"
          >
            {[...stats, { value: courseCount, label: 'Specialized Courses' }].map((stat, i) => (
              <div
                key={stat.label}
                className={`bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-5 flex flex-col justify-between${i === 3 ? ' col-span-2' : ''}`}
              >
                <div className="w-6 h-[3px] bg-primary-500 rounded-full mb-3" />
                <div className="text-[2rem] font-bold text-gray-900 leading-none tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;