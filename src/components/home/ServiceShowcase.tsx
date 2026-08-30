import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaLightbulb, 
  FaUsers, 
  FaRocket,
  FaCode,
  FaRobot,
  FaCogs,
  FaChartLine
} from 'react-icons/fa';

interface ServiceShowcaseProps {
  showcaseData?: {
    sectionTitle?: string;
    sectionSubtitle?: string;
    academy?: {
      title?: string;
      tagline?: string;
      description?: string;
      features?: Array<{ icon?: string; title: string; description: string }>;
      stats?: Array<{ value: string; label: string }>;
      ctaText?: string;
      ctaLink?: string;
    };
    consulting?: {
      title?: string;
      tagline?: string;
      description?: string;
      features?: Array<{ icon?: string; title: string; description: string }>;
      stats?: Array<{ value: string; label: string }>;
      ctaText?: string;
      ctaLink?: string;
    };
    cta?: {
      title?: string;
      subtitle?: string;
      primaryCtaText?: string;
      primaryCtaLink?: string;
      secondaryCtaText?: string;
      secondaryCtaLink?: string;
    };
  };
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FaGraduationCap: <FaGraduationCap className="w-6 h-6" />,
  FaCode: <FaCode className="w-6 h-6" />,
  FaUsers: <FaUsers className="w-6 h-6" />,
  FaRocket: <FaRocket className="w-6 h-6" />,
  FaRobot: <FaRobot className="w-6 h-6" />,
  FaCogs: <FaCogs className="w-6 h-6" />,
  FaLightbulb: <FaLightbulb className="w-6 h-6" />,
  FaChartLine: <FaChartLine className="w-6 h-6" />,
};

const defaultAcademyFeatures = [
  {
    icon: <FaGraduationCap className="w-6 h-6" />,
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with real-world experience"
  },
  {
    icon: <FaCode className="w-6 h-6" />,
    title: "Hands-On Projects",
    description: "Build portfolio-worthy projects while learning"
  },
  {
    icon: <FaUsers className="w-6 h-6" />,
    title: "Community Support",
    description: "Join a thriving community of learners and mentors"
  }
];

const defaultConsultingFeatures = [
  {
    icon: <FaRocket className="w-6 h-6" />,
    title: "Digital Transformation",
    description: "Modernize your business with cutting-edge technology"
  },
  {
    icon: <FaRobot className="w-6 h-6" />,
    title: "AI Solutions",
    description: "Leverage artificial intelligence to automate and optimize"
  },
  {
    icon: <FaCogs className="w-6 h-6" />,
    title: "Technical Consulting",
    description: "Expert guidance for your technology stack and architecture"
  }
];

const ServiceShowcase: React.FC<ServiceShowcaseProps> = ({ showcaseData }) => {
  const sectionTitle = showcaseData?.sectionTitle || "Two Paths to IT Excellence";
  const sectionSubtitle = showcaseData?.sectionSubtitle || "Whether you're looking to advance your career or transform your business, we have the expertise to guide you to success.";
  
  const academyTitle = showcaseData?.academy?.title || "ITWala Academy";
  const academyTagline = showcaseData?.academy?.tagline || "Shape Your Career";
  const academyDesc = showcaseData?.academy?.description || "Master in-demand technologies with our comprehensive courses designed by industry experts. From beginner to advanced, we'll guide you every step of the way.";
  const academyCtaText = showcaseData?.academy?.ctaText || "Explore Academy Courses";
  const academyCtaLink = showcaseData?.academy?.ctaLink || "/academy";
  const academyStats = showcaseData?.academy?.stats || [
    { value: '500+', label: 'Students' },
    { value: '8+', label: 'Courses' },
    { value: '20+', label: 'Learning Tracks' },
    { value: '80%', label: 'Job Placement' }
  ];
  const academyFeats = showcaseData?.academy?.features && showcaseData.academy.features.length > 0
    ? showcaseData.academy.features.map((f, i) => ({
        title: f.title,
        description: f.description,
        icon: typeof f.icon === 'string' && ICON_MAP[f.icon] ? ICON_MAP[f.icon] : defaultAcademyFeatures[i % defaultAcademyFeatures.length].icon,
      }))
    : defaultAcademyFeatures;

  const consultingTitle = showcaseData?.consulting?.title || "ITWala Consulting";
  const consultingTagline = showcaseData?.consulting?.tagline || "Transform Your Business";
  const consultingDesc = showcaseData?.consulting?.description || "Accelerate your business growth with our expert IT consulting services. From strategy to implementation, we deliver solutions that drive results.";
  const consultingCtaText = showcaseData?.consulting?.ctaText || "Explore Consulting Services";
  const consultingCtaLink = showcaseData?.consulting?.ctaLink || "/consulting";
  const consultingStats = showcaseData?.consulting?.stats || [
    { value: '20+', label: 'Projects' },
    { value: '50+', label: 'Consultants' },
    { value: '98%', label: 'Customer Satisfaction' }
  ];
  const consultingFeats = showcaseData?.consulting?.features && showcaseData.consulting.features.length > 0
    ? showcaseData.consulting.features.map((f, i) => ({
        title: f.title,
        description: f.description,
        icon: typeof f.icon === 'string' && ICON_MAP[f.icon] ? ICON_MAP[f.icon] : defaultConsultingFeatures[i % defaultConsultingFeatures.length].icon,
      }))
    : defaultConsultingFeatures;

  const ctaTitle = showcaseData?.cta?.title || "Ready to Get Started?";
  const ctaSubtitle = showcaseData?.cta?.subtitle || "Whether you're looking to advance your skills or transform your business, we're here to help you achieve your goals.";
  const primaryCtaText = showcaseData?.cta?.primaryCtaText || "Get Free Consultation";
  const primaryCtaLink = showcaseData?.cta?.primaryCtaLink || "/contact";
  const secondaryCtaText = showcaseData?.cta?.secondaryCtaText || "Learn More About Us";
  const secondaryCtaLink = showcaseData?.cta?.secondaryCtaLink || "/about";

  return (
    <section className="py-7 bg-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-200 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Academy Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mr-4">
                <FaGraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{academyTitle}</h3>
                <p className="text-accent-600 font-semibold">{academyTagline}</p>
              </div>
            </div>

            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {academyDesc}
            </p>

            <div className="space-y-6 mb-8">
              {academyFeats.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <div className="text-accent-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8 p-4 bg-accent-50 rounded-2xl">
              {academyStats.map((st, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-accent-600">{st.value}</div>
                  <div className="text-xs text-gray-600">{st.label}</div>
                </div>
              ))}
            </div>

            <Link href={academyCtaLink}>
              <div className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold py-4 px-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                {academyCtaText}
              </div>
            </Link>
          </motion.div>

          {/* Consulting Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mr-4">
                <FaLightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{consultingTitle}</h3>
                <p className="text-primary-600 font-semibold">{consultingTagline}</p>
              </div>
            </div>

            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              {consultingDesc}
            </p>

            <div className="space-y-6 mb-8">
              {consultingFeats.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <div className="text-primary-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-primary-50 rounded-2xl">
              {consultingStats.map((st, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{st.value}</div>
                  <div className="text-xs text-gray-600">{st.label}</div>
                </div>
              ))}
            </div>

            <Link href={consultingCtaLink}>
              <div className="w-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-semibold py-4 px-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                {consultingCtaText}
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{ctaTitle}</h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              {ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={primaryCtaLink}>
                <div className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                  {primaryCtaText}
                </div>
              </Link>
              <Link href={secondaryCtaLink}>
                <div className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105">
                  {secondaryCtaText}
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceShowcase;