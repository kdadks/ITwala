import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
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
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-11 pb-12 lg:pt-12 lg:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="h-px w-10 bg-primary-500 shrink-0" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">IT Consulting · Digital Transformation</span>
              </div>
              <h1 className="font-serif text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[1.06] text-gray-900 mb-5">
                Our Consulting{' '}
                <span className="text-gradient">Services</span>
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-[3px] h-9 bg-accent-500 rounded-full shrink-0" />
                <p className="text-[1.05rem] text-gray-600 font-medium leading-snug">
                  Comprehensive IT solutions
                  <span className="text-gray-400 font-normal"> · accelerate growth &amp; digital transformation</span>
                </p>
              </div>
              <div className="flex items-stretch divide-x divide-gray-200">
                {[
                  { value: '100+', label: 'Successful Projects' },
                  { value: '50+', label: 'Expert Consultants' },
                  { value: '24/7', label: 'Support' },
                ].map((stat) => (
                  <div key={stat.label} className="px-6 first:pl-0">
                    <div className="text-[1.6rem] font-bold text-gray-900 leading-none tracking-tight">{stat.value}</div>
                    <div className="text-[11px] uppercase tracking-[0.13em] text-gray-400 mt-1.5">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/consulting">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Consulting
                  </span>
                </Link>
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