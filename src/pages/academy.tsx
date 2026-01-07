import { NextPage } from 'next';
import Head from 'next/head';
import Hero from '@/components/home/Hero';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import Categories from '@/components/home/Categories';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';
import Stats from '@/components/home/Stats';
import Locations from '@/components/about/Locations';
import AIEducationFAQ from '@/components/seo/AIEducationFAQ';
import { motion } from 'framer-motion';

const Academy: NextPage = () => {
  return (
    <>
      <Head>
        <title>ITWala Academy - Premier AI Education & ML Training Platform</title>
        <meta name="description" content="ITWala Academy - India's leading AI education platform. Master artificial intelligence, machine learning, data science with expert instructors." />
        <meta name="keywords" content="AI education India, artificial intelligence academy, machine learning courses, data science training, AI certification program, deep learning bootcamp, neural networks course, AI career training, professional AI education, online AI academy, ML engineering courses, AI skills development" />
        <meta property="og:title" content="ITWala Academy - Premier AI Education & Machine Learning Training Platform" />
        <meta property="og:description" content="Transform your career with ITWala Academy's comprehensive AI education. Master artificial intelligence, machine learning, and data science with industry experts and hands-on projects." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.it-wala.com/academy" />
        <meta property="og:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ITWala Academy - AI Education & ML Training Platform" />
        <meta name="twitter:description" content="Master AI & ML with comprehensive courses, expert instructors, and hands-on projects. Industry-recognized certifications and career support." />
        <meta name="twitter:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <link rel="canonical" href="https://academy.it-wala.com/academy" />
        
        {/* Schema for Academy Page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "ITWala Academy",
            "alternateName": "ITWala AI Academy",
            "description": "Premier AI education platform offering comprehensive artificial intelligence, machine learning, and data science courses",
            "url": "https://academy.it-wala.com/academy",
            "logo": "https://academy.it-wala.com/images/IT - WALA_logo (1).png",
            "foundingDate": "2020",
            "numberOfEmployees": "50-100",
            "areaServed": "Worldwide",
            "educationalCredentialAwarded": "AI and Machine Learning Certification",
            "hasCredential": {
              "@type": "EducationalOccupationalCredential",
              "name": "AI and Machine Learning Professional Certificate",
              "description": "Industry-recognized certification in artificial intelligence and machine learning"
            },
            "offers": [
              {
                "@type": "Course",
                "name": "AI & Machine Learning Fundamentals",
                "description": "Comprehensive AI and ML training with hands-on projects",
                "provider": "ITWala Academy",
                "courseMode": "online"
              },
              {
                "@type": "Course",
                "name": "Data Science Professional Program",
                "description": "Complete data science training with real-world applications",
                "provider": "ITWala Academy",
                "courseMode": "online"
              }
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "500",
              "bestRating": "5"
            }
          })}
        </script>
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
          className="-mt-4"
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Locations />
        </motion.div>
      </main>
    </>
  );
};

export default Academy;