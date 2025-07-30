import { NextPage } from 'next';
import Head from 'next/head';
import UnifiedHero from '@/components/home/UnifiedHero';
import ServiceShowcase from '@/components/home/ServiceShowcase';
import Stats from '@/components/home/Stats';
import Testimonials from '@/components/home/Testimonials';
import BacklinkingHub from '@/components/seo/BacklinkingHub';
import { motion } from 'framer-motion';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ITWala Academy - #1 AI Education Platform | Master AI & ML</title>
        <meta name="description" content="Join ITWala Academy, the premier AI education platform. Master artificial intelligence, machine learning, data science with expert-led courses and hands-on projects." />
        <meta name="keywords" content="AI education platform, artificial intelligence courses, machine learning training, AI bootcamp, data science certification, deep learning courses, neural networks training, AI career development, online AI education, professional AI training, AI academy, machine learning bootcamp, AI skills development" />
        <meta property="og:title" content="ITWala Academy - #1 AI Education Platform | Master AI & ML" />
        <meta property="og:description" content="Transform your career with ITWala Academy's comprehensive AI education. Master artificial intelligence, machine learning, and data science with expert instructors and hands-on projects." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.it-wala.com" />
        <meta property="og:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ITWala Academy - Premier AI Education Platform" />
        <meta name="twitter:description" content="Master AI & ML with comprehensive courses, expert instructors, and hands-on projects. Join 500+ students advancing their AI careers today." />
        <meta name="twitter:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <link rel="canonical" href="https://academy.it-wala.com" />
        
        {/* Additional Schema for Homepage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ITWala Academy",
            "url": "https://academy.it-wala.com",
            "description": "Premier AI education platform offering comprehensive artificial intelligence and machine learning courses",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://academy.it-wala.com/courses?search={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "ITWala Academy",
              "logo": "https://academy.it-wala.com/images/IT - WALA_logo (1).png"
            }
          })}
        </script>
      </Head>

      <main>
        <UnifiedHero />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ServiceShowcase />
        </motion.div>
        
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Stats />
        </motion.div> */}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-16"
        >
          <Testimonials />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <BacklinkingHub currentPage="home" />
        </motion.div>
      </main>
    </>
  );
};

export default Home;