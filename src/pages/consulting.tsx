import { NextPage } from 'next';
import Head from 'next/head';
import ConsultingHero from '../components/consulting/ConsultingHero';
import ServicesGrid from '../components/consulting/ServicesGrid';
import WhyChooseUs from '../components/consulting/WhyChooseUs';
import ProcessSection from '../components/consulting/ProcessSection';
import ConsultingCTA from '../components/consulting/ConsultingCTA';
import BacklinkingHub from '@/components/seo/BacklinkingHub';
import SEOHead from '@/components/seo/SEOHead';
import { useCMSData } from '@/lib/cms';

const DEFAULT_CONSULTING_CMS = {
  hero: {
    badge: '💻 Dedicated Developers for Hire',
    title: 'Hire Senior Engineering Talent',
    subtitle: 'Scale your product team with battle-tested software engineers, frontend leads, and DevOps specialists.',
    primaryCtaText: 'Hire Developers',
    primaryCtaLink: '/contact',
  },
  seo: {
    metaTitle: 'ITWala Consulting - Expert IT Solutions & Digital Transformation',
    metaDescription: 'ITWala Consulting offers comprehensive IT solutions including AI implementation, digital transformation, technical consulting, and product development.',
    keywords: 'IT consulting, product strategy, digital transformation, AI solutions, technical consulting',
    ogImage: '',
  },
};

const Consulting: NextPage = () => {
  const { cmsData } = useCMSData('consulting', DEFAULT_CONSULTING_CMS);
  const seo = cmsData.seo || DEFAULT_CONSULTING_CMS.seo;

  return (
    <>
      <SEOHead
        title={seo.metaTitle}
        description={seo.metaDescription}
        keywords={seo.keywords}
        canonicalUrl="https://it-wala.com/consulting"
        ogImage={seo.ogImage}
      />

      <main>
        <ConsultingHero hero={cmsData.hero} heroStats={cmsData.hero_stats} />
        <ServicesGrid servicesData={cmsData.services_grid} />
        <WhyChooseUs whyChooseData={cmsData.why_choose_us} />
        
        <ProcessSection processData={cmsData.process_steps} />
        <ConsultingCTA ctaData={cmsData.cta} />
        
        {/* Internal Linking Hub */}
        <BacklinkingHub currentPage="services" />
      </main>
    </>
  );
};

export default Consulting;