import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/currency';

interface Course {
  title: string;
  description: string;
  level: string;
  price: number;
  image: string;
  feesDiscussedPostEnrollment?: boolean;
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
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 lg:pt-32 lg:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px w-10 bg-primary-500 shrink-0" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">
              ITwala Academy · {course.level}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-[2.2rem] sm:text-[2.8rem] lg:text-[3.4rem] leading-[1.08] text-gray-900 mb-5">
            {course.title}
          </h1>

          {/* Accent bar + description */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-[3px] min-h-[2.25rem] bg-accent-500 rounded-full shrink-0 mt-1" />
            <p className="text-[1.05rem] text-gray-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Price + enroll */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onEnroll}
              disabled={!enrollmentsEnabled}
              className={`inline-flex items-center gap-2 h-12 px-7 rounded-lg font-semibold text-sm shadow-md transition-all duration-200 ${
                enrollmentsEnabled
                  ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/20'
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
              }`}
            >
              {enrollmentsEnabled ? 'Enroll Now' : 'Enrollment Disabled'}
            </button>

            <div className="flex items-stretch divide-x divide-gray-200">
              <div className="pr-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-0.5">Registration Fee</p>
                {course.feesDiscussedPostEnrollment ? (
                  <p className="text-sm font-semibold text-accent-500">Discussed post enrollment</p>
                ) : (
                  <p className="text-[1.1rem] font-bold text-gray-900">{formatCurrency(course.price, { decimals: 0 })}</p>
                )}
              </div>
              <div className="pl-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-0.5">Level</p>
                <p className="text-sm font-semibold text-gray-700">{course.level}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseBanner;