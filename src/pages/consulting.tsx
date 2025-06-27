import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import ConsultingHero from '../components/consulting/ConsultingHero';
import ServicesGrid from '../components/consulting/ServicesGrid';
import WhyChooseUs from '../components/consulting/WhyChooseUs';
import ConsultingStats from '../components/consulting/ConsultingStats';
import ProcessSection from '../components/consulting/ProcessSection';
import ConsultingCTA from '../components/consulting/ConsultingCTA';

const Consulting: NextPage = () => {
  return (
    <>
      <Head>
        <title>ITWala Product & Consulting - Transform Your Business with Expert IT Solutions</title>
        <meta name="description" content="ITWala Product & Consulting offers comprehensive IT solutions including Product Strategy, Technical Consulting, Digital Transformation, IT Staffing, Product Development, AI Solutions, and Training & Development." />
        <meta name="keywords" content="IT consulting, product strategy, digital transformation, AI solutions, technical consulting, IT staffing, product development, training development" />
        <meta property="og:title" content="ITWala Product & Consulting - Expert IT Solutions" />
        <meta property="og:description" content="Transform your business with our comprehensive IT consulting services. From strategy to implementation, we deliver results." />
        <meta property="og:type" content="website" />
      </Head>

      <main>
        <ConsultingHero />
        <ServicesGrid />
        <WhyChooseUs />
        <ConsultingStats />
        <ProcessSection />
        <ConsultingCTA />
      </main>
    </>
  );
};

export default Consulting;