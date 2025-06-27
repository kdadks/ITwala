import { NextPage } from 'next';
import Head from 'next/head';
import Hero from '@/components/home/Hero';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import Categories from '@/components/home/Categories';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';
import Stats from '@/components/home/Stats';
import { motion } from 'framer-motion';

const Academy: NextPage = () => {
  return (
    <>
      <Head>
        <title>ITWala Academy - Innovate today for better tomorrow</title>
        <meta name="description" content="Master cutting-edge technologies with ITWala Academy. Expert-led courses, hands-on projects, and comprehensive learning paths to advance your IT career." />
        <meta name="keywords" content="IT courses, programming training, technology education, coding bootcamp, software development, web development, mobile app development" />
        <meta property="og:title" content="ITWala Academy - Transform Your IT Career" />
        <meta property="og:description" content="Join 500+ students learning cutting-edge technologies with industry experts. Build your career with hands-on projects and comprehensive courses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://itwala.com/academy" />
        <link rel="canonical" href="https://itwala.com/academy" />
      </Head>

      <main>
        <Hero />
        
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
          <Stats />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Testimonials />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <CtaSection />
        </motion.div>
      </main>
    </>
  );
};

export default Academy;