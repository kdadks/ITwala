import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import ServicesGrid from '../../components/consulting/ServicesGrid';
import WhyChooseUs from '../../components/consulting/WhyChooseUs';
import ConsultingStats from '../../components/consulting/ConsultingStats';
import ConsultingCTA from '../../components/consulting/ConsultingCTA';

const ServicesIndex: NextPage = () => {
  return (
    <>
      <Head>
        <title>Our Services - ITwala Consulting</title>
        <meta name="description" content="Comprehensive IT consulting services including product development, AI solutions, digital transformation, technical consulting, and IT staffing." />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Consulting Services</h1>
              <p className="text-xl text-white/90 mb-8">
                Comprehensive IT solutions designed to accelerate your business growth and digital transformation journey
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center justify-center text-white/90"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  100+ Successful Projects
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center justify-center text-white/90"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  50+ Expert Consultants
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center justify-center text-white/90"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  24/7 Support
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <ServicesGrid />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Stats Section */}
        <ConsultingStats />

        {/* CTA Section */}
        <ConsultingCTA />
      </main>
    </>
  );
};

export default ServicesIndex;