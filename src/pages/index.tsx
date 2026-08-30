import { NextPage } from 'next';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import UnifiedHero from '@/components/home/UnifiedHero';
import ServiceShowcase from '@/components/home/ServiceShowcase';
import Stats from '@/components/home/Stats';
import FeaturedCourses from '@/components/academy/FeaturedCourses';
import Testimonials from '@/components/home/Testimonials';
import BacklinkingHub from '@/components/seo/BacklinkingHub';
import { motion } from 'framer-motion';
import { resolveCountryFromRequest, fromPagesReq } from '@/utils/countryDetection';
import SEOHead from '@/components/seo/SEOHead';
import { useCMSData } from '@/lib/cms';

interface HomeProps {
  initialCountry: string;
}

const DEFAULT_SEO = {
  hero: { title: '', subtitle: '' },
  seo: {
    metaTitle: 'ITWala - Web Development, AI Academy & IT Consulting Globally',
    metaDescription: '#1 Web development company & AI Academy. Free AI education resources plus AI crash courses and full programs for beginners and professionals.',
    keywords: 'web development company, AI education platform, AI academy, coding bootcamp',
    ogImage: 'https://it-wala.com/images/IT - WALA_logo (1).png',
  },
};

const Home: NextPage<HomeProps> = ({ initialCountry }) => {
  const { cmsData } = useCMSData('home', DEFAULT_SEO);
  const seo = cmsData.seo || DEFAULT_SEO.seo;

  return (
    <>
      <SEOHead
        title={seo.metaTitle}
        description={seo.metaDescription}
        keywords={seo.keywords}
        canonicalUrl="https://it-wala.com"
        ogImage={seo.ogImage || "https://it-wala.com/images/IT - WALA_logo (1).png"}
      />
      <Head>
        
        {/* Additional Schema for Homepage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ITWala",
            "alternateName": "IT Wala",
            "url": "https://it-wala.com",
            "description": "Global leader in web development, AI education, custom software development, IT consulting, product development, digital transformation, training & IT staffing",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://it-wala.com/courses?search={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "ITWala",
              "logo": "https://it-wala.com/images/IT - WALA_logo (1).png"
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
                "description": "Artificial intelligence education, machine learning training, data science courses for beginners and professionals"
              },
              {
                "@type": "Thing",
                "name": "AI Academy",
                "description": "AI Academy offering free AI education resources, AI crash courses, and structured learning paths for beginners through professionals"
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
          <ServiceShowcase showcaseData={cmsData.service_showcase} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FeaturedCourses initialCountry={initialCountry} />
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
          <Testimonials testimonialsData={cmsData.testimonials} />
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

export const getServerSideProps: GetServerSideProps<HomeProps> = async (ctx) => {
  const resolution = resolveCountryFromRequest(fromPagesReq(ctx.req));
  return {
    props: {
      initialCountry: resolution.country,
    },
  };
};