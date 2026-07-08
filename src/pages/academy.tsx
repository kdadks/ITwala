import { NextPage } from 'next';
import Head from 'next/head';
import Hero from '@/components/home/Hero';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import Categories from '@/components/home/Categories';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';
import Locations from '@/components/about/Locations';
import AIEducationFAQ from '@/components/seo/AIEducationFAQ';
import { motion } from 'framer-motion';

const Academy: NextPage = () => {
  return (
    <>
      <Head>
        <title>ITWala AI Academy - AI Education, Crash Courses & Training</title>
        <meta name="description" content="ITWala AI Academy - free AI education resources, an AI crash course, and full AI/ML programs for beginners and professionals. Learn artificial intelligence with expert instructors." />
        <meta name="keywords" content="AI academy, AI crash course, free AI education, AI courses for beginners, AI courses for professionals, where to learn AI, AI education India, artificial intelligence academy, machine learning courses, data science training, AI certification program, deep learning bootcamp, neural networks course, AI career training, professional AI education, online AI academy, ML engineering courses, AI skills development" />
        <meta property="og:title" content="ITWala AI Academy - AI Education, Crash Courses & Training" />
        <meta property="og:description" content="ITWala AI Academy: free AI education resources, an AI crash course, and full AI/ML training programs for beginners and professionals, with industry experts and hands-on projects." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://it-wala.com/academy" />
        <meta property="og:image" content="https://it-wala.com/images/IT - WALA_logo (1).png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ITWala AI Academy - AI Education & Crash Courses" />
        <meta name="twitter:description" content="Free AI education resources, an AI crash course, and full AI/ML programs for beginners and professionals. Industry-recognized certifications and career support." />
        <meta name="twitter:image" content="https://it-wala.com/images/IT - WALA_logo (1).png" />
        <link rel="canonical" href="https://it-wala.com/academy" />
        
        {/* Schema for Academy Page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "ITWala Academy",
            "alternateName": "ITWala AI Academy",
            "description": "AI Academy offering free AI education resources, an AI crash course, and comprehensive artificial intelligence, machine learning, and data science courses for beginners and professionals",
            "url": "https://it-wala.com/academy",
            "logo": "https://it-wala.com/images/IT - WALA_logo (1).png",
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
                "description": "Fast-paced AI crash course covering AI and machine learning fundamentals with hands-on projects, ideal for complete beginners",
                "provider": "ITWala Academy",
                "courseMode": "online",
                "educationalLevel": "Beginner"
              },
              {
                "@type": "Course",
                "name": "Data Science Professional Program",
                "description": "Complete data science training with real-world applications for working professionals",
                "provider": "ITWala Academy",
                "courseMode": "online",
                "educationalLevel": "Professional"
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
        >
          <Testimonials />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <CtaSection />
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