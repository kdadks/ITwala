import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ConsultingHero from '../components/consulting/ConsultingHero';
import ServicesGrid from '../components/consulting/ServicesGrid';
import WhyChooseUs from '../components/consulting/WhyChooseUs';
import ConsultingStats from '../components/consulting/ConsultingStats';
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
        
        {/* Showcase Products Section - Moved after WhyChooseUs */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-600 rounded-full blur-xl"></div>
            <div className="absolute top-32 right-20 w-32 h-32 bg-purple-600 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500 rounded-full blur-xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                  <span className="text-indigo-600 font-semibold uppercase tracking-wide text-sm">Live Products</span>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full ml-2"></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Showcase Products by ITWala Consulting
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Explore some of the innovative products built and launched by our team - real solutions making real impact in the market.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.a
                  href="https://www.raahirides.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="group block bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50">
                      <Image
                        src="/images/raahi_rides_logo.png"
                        alt="RaahiRides Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-indigo-700 mb-3 group-hover:text-indigo-800 transition-colors">RaahiRides</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    Travel apps for Eastern UP, connecting travelers and drivers for a seamless journey. Comprehensive travel solutions from point-to-point journeys to corporate retreats.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-500 font-medium text-sm">Travel Industry</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors group-hover:translate-x-1 transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </motion.a>

                <motion.a
                  href="https://www.how2doai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="group block bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-cyan-50">
                      <Image
                        src="/images/logo.png"
                        alt="How2doAI Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-cyan-700 mb-3 group-hover:text-cyan-800 transition-colors">How2doAI</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    A comprehensive AI app finder and comparison platform, enabling AI automation for end-to-end workflows. Discover, compare, and integrate top AI tools.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-500 font-medium text-sm">Artificial Intelligence</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition-colors group-hover:translate-x-1 transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </motion.a>

                <motion.a
                  href="https://ayuhclinic.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="group block bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50">
                      <Image
                        src="/images/AYUH_Logo_2.png"
                        alt="Ayuh Clinic Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-3 group-hover:text-green-800 transition-colors">Ayuh Clinic</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    Comprehensive Healthcare Solutions. From professional home care services to natural homeopathic healing - integrated healthcare with compassion and expertise.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-500 font-medium text-sm">Healthcare</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors group-hover:translate-x-1 transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
        
        <ConsultingStats />
        <ProcessSection />
        <ConsultingCTA />
        
        {/* Internal Linking Hub */}
        <BacklinkingHub currentPage="services" />
      </main>
    </>
  );
};

export default Consulting;