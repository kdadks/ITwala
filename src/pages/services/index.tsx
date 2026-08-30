import { NextPage } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import ServicesGrid from '../../components/consulting/ServicesGrid';
import WhyChooseUs from '../../components/consulting/WhyChooseUs';
import ConsultingStats from '../../components/consulting/ConsultingStats';
import ConsultingCTA from '../../components/consulting/ConsultingCTA';
import SEOHead from '@/components/seo/SEOHead';
import { useCMSData } from '@/lib/cms';

const DEFAULT_SERVICES_CMS = {
  hero: {
    badge: 'IT Consulting · Digital Transformation',
    title: 'Our Consulting Services',
    subtitle: 'Comprehensive IT solutions to accelerate growth & digital transformation.',
  },
  stats: [
    { value: '100+', label: 'Successful Projects' },
    { value: '50+', label: 'Expert Consultants' },
    { value: '24/7', label: 'Support' },
  ],
  seo: {
    metaTitle: 'Web Development & IT Consulting Services - ITwala',
    metaDescription: 'Comprehensive web development and IT consulting services including product development, AI solutions, digital transformation, technical consulting, and IT staffing.',
    keywords: 'web development company, web development services, IT consulting services, product development, AI solutions, digital transformation, technical consulting, IT staffing',
    ogImage: '',
  },
};

const ServicesIndex: NextPage = () => {
  const { cmsData } = useCMSData('services', DEFAULT_SERVICES_CMS);
  const hero = cmsData.hero || DEFAULT_SERVICES_CMS.hero;
  const seo = cmsData.seo || DEFAULT_SERVICES_CMS.seo;
  const stats = cmsData.stats || DEFAULT_SERVICES_CMS.stats;

  return (
    <>
      <SEOHead
        title={seo.metaTitle}
        description={seo.metaDescription}
        keywords={seo.keywords}
        canonicalUrl="https://it-wala.com/services"
        ogImage={seo.ogImage}
      />

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
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">{hero.badge || 'IT Consulting · Digital Transformation'}</span>
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
              <div className="flex items-stretch divide-x divide-gray-200">
                {stats.map((stat, i) => (
                  <div key={i} className="px-6 first:pl-0">
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
        <ServicesGrid servicesData={cmsData.services_grid} />

        {/* Why Choose Us */}
        <WhyChooseUs whyChooseData={cmsData.why_choose_us} />

        {/* Stats Section */}
        <ConsultingStats statsData={cmsData.consulting_stats} />

        {/* CTA Section */}
        <ConsultingCTA ctaData={cmsData.consulting_cta} />
      </main>
    </>
  );
};

export default ServicesIndex;