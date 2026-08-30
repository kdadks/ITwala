import { NextPage } from 'next';
import Head from 'next/head';
import AcademyHero from '@/components/academy/AcademyHero';
import FeaturedCourses from '@/components/academy/FeaturedCourses';
import Categories from '@/components/academy/Categories';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';
import Locations from '@/components/about/Locations';
import SEOHead from '@/components/seo/SEOHead';
import { motion } from 'framer-motion';
import { useCMSData } from '@/lib/cms';

const DEFAULT_ACADEMY_CMS = {
  hero: {
    badge: '🎓 ITWala AI Academy · Future-Proof Skills',
    title: 'Master AI & Machine Learning',
    subtitle: 'Learn artificial intelligence, data science, and modern software engineering with hands-on projects, expert mentorship, and industry certifications.',
    primaryCtaText: 'Browse Courses',
    primaryCtaLink: '/courses',
    secondaryCtaText: 'Free Resources',
    secondaryCtaLink: '/resources',
  },
  seo: {
    metaTitle: 'ITWala AI Academy - AI Education, Crash Courses & Training',
    metaDescription: 'ITWala AI Academy - free AI education resources, an AI crash course, and full AI/ML programs for beginners and professionals.',
    keywords: 'AI academy, AI crash course, free AI education, AI courses for beginners, AI courses for professionals',
    ogImage: '',
  },
};

const Academy: NextPage = () => {
  const { cmsData } = useCMSData('academy', DEFAULT_ACADEMY_CMS);
  const seo = cmsData?.seo || DEFAULT_ACADEMY_CMS.seo;

  return (
    <>
      <SEOHead
        title={seo.metaTitle}
        description={seo.metaDescription}
        keywords={seo.keywords}
        canonicalUrl="https://it-wala.com/academy"
        ogImage={seo.ogImage}
      />

      <main>
        <AcademyHero heroData={cmsData.hero} heroStats={cmsData.hero_stats} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Categories />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FeaturedCourses />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Testimonials testimonialsData={cmsData.testimonials} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <CtaSection ctaData={cmsData.cta} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Locations />
        </motion.div>
      </main>
    </>
  );
};

export default Academy;