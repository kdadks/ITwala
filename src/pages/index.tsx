import { NextPage } from 'next';
import Head from 'next/head';
import UnifiedHero from '@/components/home/UnifiedHero';
import ServiceShowcase from '@/components/home/ServiceShowcase';
import Stats from '@/components/home/Stats';
import Testimonials from '@/components/home/Testimonials';
import { motion } from 'framer-motion';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ITWala - Your Complete IT Partner | Academy & Consulting</title>
        <meta name="description" content="ITWala offers world-class IT education through our Academy and expert business transformation through our Consulting services. Shape your career and transform your business with IT excellence." />
        <meta name="keywords" content="IT education, IT consulting, programming courses, digital transformation, AI solutions, technical training, business consulting" />
        <meta property="og:title" content="ITWala - Your Complete IT Partner" />
        <meta property="og:description" content="Empowering individuals through education and transforming businesses through expert consulting. Your journey to IT excellence starts here." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://itwala.com" />
        <link rel="canonical" href="https://itwala.com" />
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
      </main>
    </>
  );
};

export default Home;