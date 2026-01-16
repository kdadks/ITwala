import { NextPage } from 'next';
import Head from 'next/head';
import UnifiedHero from '@/components/home/UnifiedHero';
import ServiceShowcase from '@/components/home/ServiceShowcase';
import Stats from '@/components/home/Stats';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import Testimonials from '@/components/home/Testimonials';
import BacklinkingHub from '@/components/seo/BacklinkingHub';
import { motion } from 'framer-motion';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ITWala - Top Web Development, AI Education & IT Consulting Globally</title>
        <meta name="description" content="#1 Web development company, AI education platform & IT consulting firm. Custom software development, edutech training, product development, digital transformation, training programs & IT staffing solutions worldwide." />
        <meta name="keywords" content="web development company, AI education platform, edutech solutions, custom software development, AI development services, IT consulting firm, product development services, digital transformation consulting, training and development, IT staffing partner, full stack development, react development, node.js development, machine learning courses, AI training online, enterprise software development, mobile app development, cloud development services, DevOps consulting, agile development, software engineering, technology consulting, IT recruitment, tech talent acquisition, SaaS development, API development, microservices, e-learning platform, online courses, professional training" />
        <meta property="og:title" content="ITWala - #1 Web Development, AI Education & IT Consulting Worldwide" />
        <meta property="og:description" content="Leading web development company, AI education platform & IT consulting services. Custom software, edutech solutions, product development, digital transformation & IT staffing globally." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.it-wala.com" />
        <meta property="og:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ITWala - Top Web Dev, AI Education & IT Consulting" />
        <meta name="twitter:description" content="Global leader: Web development, AI education platform, custom software, product development, digital transformation, training programs & IT staffing solutions." />
        <meta name="twitter:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <link rel="canonical" href="https://academy.it-wala.com" />
        
        {/* Additional Schema for Homepage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ITWala",
            "alternateName": "IT Wala",
            "url": "https://academy.it-wala.com",
            "description": "Global leader in web development, AI education, custom software development, IT consulting, product development, digital transformation, training & IT staffing",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://academy.it-wala.com/courses?search={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ITWala",
              "logo": "https://academy.it-wala.com/images/IT - WALA_logo (1).png"
            },
            "about": [
              {
                "@type": "Thing",
                "name": "Web Development",
                "description": "Custom web development, full-stack development, React, Node.js applications"
              },
              {
                "@type": "Thing",
                "name": "AI Education",
                "description": "Artificial intelligence education, machine learning training, data science courses"
              },
              {
                "@type": "Thing",
                "name": "Edutech Platform",
                "description": "Educational technology solutions, online learning platform, e-learning"
              },
              {
                "@type": "Thing",
                "name": "Custom Software Development",
                "description": "Enterprise software, mobile apps, SaaS products, API development"
              },
              {
                "@type": "Thing",
                "name": "IT Consulting",
                "description": "Technology consulting, IT strategy, solution architecture"
              },
              {
                "@type": "Thing",
                "name": "Digital Transformation",
                "description": "Digital transformation consulting, cloud migration, process automation"
              },
              {
                "@type": "Thing",
                "name": "IT Staffing",
                "description": "IT recruitment, tech talent acquisition, staff augmentation"
              }
            ]
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FeaturedCourses />
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