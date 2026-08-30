import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CompanyMission from '../components/about/CompanyMission';
import Link from 'next/link';

import SEOHead from '@/components/seo/SEOHead';
import { useCMSData } from '@/lib/cms';

const DEFAULT_ABOUT_CMS = {
  hero: {
    badge: 'Our Story · Mission & Values',
    title: 'About ITwala Academy & Consulting',
    subtitle: 'Empowering businesses and individuals with comprehensive IT education & consulting solutions.',
    primaryCtaText: 'Our Story',
    primaryCtaLink: '#our-story',
  },
  seo: {
    metaTitle: 'About ITwala Academy - AI Academy & Web Development Experts',
    metaDescription: 'Learn about ITwala Academy mission to provide world-class AI education, web development, and IT consulting services.',
    keywords: 'ITwala Academy, AI academy, AI education, web development, IT consulting, about ITwala',
    ogImage: '',
  },
};

const About: NextPage = () => {
  const { cmsData } = useCMSData('about', DEFAULT_ABOUT_CMS);
  const hero = cmsData.hero || DEFAULT_ABOUT_CMS.hero;
  const seo = cmsData.seo || DEFAULT_ABOUT_CMS.seo;

  return (
    <>
      <SEOHead
        title={seo.metaTitle}
        description={seo.metaDescription}
        keywords={seo.keywords}
        canonicalUrl="https://it-wala.com/about"
        ogImage={seo.ogImage}
      />

      <main>
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
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">{hero.badge || 'Our Story · Mission & Values'}</span>
              </div>
              <h1 className="font-serif text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] leading-[1.06] text-gray-900 mb-5">
                {hero.title}
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-[3px] h-9 bg-accent-500 rounded-full shrink-0" />
                <p className="text-[1.05rem] text-gray-600 font-medium leading-snug">
                  {hero.subtitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a href="#our-story" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white h-12 px-7 rounded-lg font-semibold text-sm shadow-md shadow-primary-500/20 transition-all duration-200">
                  Our Story
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <CompanyMission missionData={cmsData.mission_cards} />
        
        {/* Consulting Services Overview Section */}
        <section className="py-6 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center mb-12"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
                {cmsData.consulting_services?.sectionTitle || "ITwala Consulting Services"}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {cmsData.consulting_services?.sectionSubtitle || "Beyond education, we provide comprehensive IT consulting services to help businesses transform and grow"}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(cmsData.consulting_services?.services || [
                { title: 'Product Development', description: 'End-to-end product development from concept to deployment with market research and go-to-market strategy.' },
                { title: 'AI Solutions', description: 'Cutting-edge AI and machine learning solutions including agentic AI, automation, and intelligent decision-making systems.' },
                { title: 'Digital Transformation', description: 'Comprehensive digital transformation services including cloud migration, process automation, and modernization.' }
              ]).map((service: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (idx + 1) * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="text-primary-600 mb-4">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link href="/services" className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors duration-300 transform hover:scale-105">
                {cmsData.consulting_services?.ctaText || "Explore All Services"}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
        
        <section id="our-story" className="py-6 bg-gradient-to-br from-white via-secondary-50 to-primary-50 scroll-mt-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src={cmsData.our_story?.image || "/images/IT - WALA_logo (1).png"}
                    alt="ITwala"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-2xl"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-3xl font-bold text-primary-700 mb-6">{cmsData.our_story?.title || "Our Story"}</h2>
                <p className="text-primary-900 mb-4 font-medium">
                  {cmsData.our_story?.motto || "Innovate today for better tomorrow"}
                </p>
                {(cmsData.our_story?.paragraphs || [
                  "ITwala is a comprehensive technology company offering both world-class IT education and professional consulting services. Our Academy division provides high-quality, industry-relevant training to empower individuals and professionals, while our Consulting division delivers cutting-edge solutions to businesses of all sizes.",
                  "Through our Academy, we focus on hands-on experience and real-world applications to bridge the gap between education and employment. Our industry-expert instructors and practical learning approach ensure students gain the skills needed to succeed in today's competitive market.",
                  "Our Consulting division leverages over 10 years of industry experience to provide comprehensive IT solutions including product development, AI-powered solutions, digital transformation, technical consulting, and IT staffing services. This unique combination allows our students to gain invaluable hands-on experience in a thriving technology environment while enabling businesses to access top-tier consulting expertise."
                ]).map((p: string, i: number) => (
                  <p key={i} className="text-gray-700 mb-4">
                    {p}
                  </p>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Locations Section */}
        <section className="py-6 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{cmsData.global_presence?.sectionTitle || "Our Global Presence"}</h2>
              <p className="text-lg text-gray-600">
                {cmsData.global_presence?.sectionSubtitle || "We operate across multiple continents to serve our global community"}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(cmsData.global_presence?.locations || [
                { country: 'Ireland', city: 'Dublin' },
                { country: 'United Kingdom', city: 'London' },
                { country: 'India', city: 'Bengaluru' },
                { country: 'India', city: 'Lucknow' }
              ]).map((loc: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-lg text-center"
                >
                  <div className="text-primary-600 mb-4">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{loc.country}</h3>
                  <p className="text-gray-600">{loc.city}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="bg-white rounded-lg p-6 shadow-lg inline-block">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Get In Touch</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {cmsData.global_presence?.contactInfo?.email || "support@it-wala.com"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {cmsData.global_presence?.contactInfo?.phone || "+91 7982303199"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Office Hours:</span> {cmsData.global_presence?.contactInfo?.officeHours || "Monday - Friday: 9 AM - 5 PM"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
      </main>
    </>
  );
};

export default About;