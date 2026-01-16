import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ConsultingHero from '../components/consulting/ConsultingHero';
import ServicesGrid from '../components/consulting/ServicesGrid';
import WhyChooseUs from '../components/consulting/WhyChooseUs';
import ProcessSection from '../components/consulting/ProcessSection';
import ConsultingCTA from '../components/consulting/ConsultingCTA';
import BacklinkingHub from '@/components/seo/BacklinkingHub';

const Consulting: NextPage = () => {
  return (
    <>
      <Head>
        <title>ITWala Consulting - Expert IT Solutions & Digital Transformation</title>
        <meta name="description" content="ITWala Consulting offers comprehensive IT solutions including AI implementation, digital transformation, technical consulting, and product development." />
        <meta name="keywords" content="IT consulting, product strategy, digital transformation, AI solutions, technical consulting, IT staffing, product development, training development" />
        <meta property="og:title" content="ITWala Product & Consulting - Expert IT Solutions" />
        <meta property="og:description" content="Transform your business with our comprehensive IT consulting services. From strategy to implementation, we deliver results." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://academy.it-wala.com/consulting" />
      </Head>

      <main>
        <ConsultingHero />
        <ServicesGrid />
        <WhyChooseUs />
        
        <ProcessSection />
        <ConsultingCTA />
        
        {/* Internal Linking Hub */}
        <BacklinkingHub currentPage="services" />
      </main>
    </>
  );
};

export default Consulting;