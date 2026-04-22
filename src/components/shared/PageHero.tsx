import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

interface PageHeroCTA {
  label: string;
  href: string;
  primary?: boolean;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  ctas?: PageHeroCTA[];
  children?: React.ReactNode;
}

/**
 * Shared page-level hero section — white bg + mesh gradient backdrop,
 * matching the doctorfolio minimalist style used across the site.
 */
const PageHero = ({ eyebrow, title, titleHighlight, description, ctas, children }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Mesh gradient backdrop */}
      <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />
      {/* Vertical accent rule (desktop) */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 lg:pt-32 lg:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          {eyebrow && (
            <div className="flex items-center gap-3 mb-7">
              <div className="h-px w-10 bg-primary-500 shrink-0" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">
                {eyebrow}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1 className="font-serif text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[1.06] text-gray-900 mb-5">
            {title}
            {titleHighlight && (
              <>
                {' '}
                <span className="text-gradient">{titleHighlight}</span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-[0.97rem] text-gray-500 leading-[1.85] max-w-[540px] mb-8">
            {description}
          </p>

          {/* CTAs */}
          {ctas && ctas.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {ctas.map((cta) =>
                cta.primary ? (
                  <Link key={cta.href} href={cta.href}>
                    <span className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white h-12 px-7 rounded-lg font-semibold text-sm shadow-md shadow-primary-500/20 transition-all duration-200">
                      {cta.label}
                    </span>
                  </Link>
                ) : (
                  <Link key={cta.href} href={cta.href}>
                    <span className="inline-flex items-center gap-1.5 h-12 px-5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm font-medium transition-all duration-200">
                      {cta.label} →
                    </span>
                  </Link>
                )
              )}
            </div>
          )}

          {/* Slot for custom content */}
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
