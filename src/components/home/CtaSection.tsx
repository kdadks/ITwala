import Link from 'next/link';
import { motion } from 'framer-motion';

interface ReasonItem {
  title: string;
  description: string;
}

interface CtaSectionProps {
  ctaData?: {
    title?: string;
    subtitle?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    whyChooseTitle?: string;
    reasons?: ReasonItem[];
  };
}

const defaultReasons: ReasonItem[] = [
  {
    title: 'Training by Industry Experts',
    description: 'Learn directly from professionals who have real-world experience in the field'
  },
  {
    title: 'Practical Learning Experience',
    description: 'Apply concepts through hands-on projects and real-world scenarios'
  },
  {
    title: 'IT Company Work Experience',
    description: 'Real work experience through hands-on industry projects'
  },
  {
    title: 'Flexible Learning Schedule',
    description: 'Study at your own pace, anytime and anywhere'
  }
];

const CtaSection: React.FC<CtaSectionProps> = ({ ctaData }) => {
  const mainTitle = ctaData?.title || 'Ready to advance your IT career?';
  const mainSubtitle = ctaData?.subtitle || 'Join thousands of students learning in-demand IT skills from industry professionals. Start your journey today with our specialized courses.';
  const primaryCtaText = ctaData?.primaryCtaText || 'Browse All Courses';
  const primaryCtaLink = ctaData?.primaryCtaLink || '/courses';
  const secondaryCtaText = ctaData?.secondaryCtaText || 'Contact Us';
  const secondaryCtaLink = ctaData?.secondaryCtaLink || '/contact';
  const whyTitle = ctaData?.whyChooseTitle || 'Why Choose ITwala Academy?';
  const reasonsList = ctaData?.reasons && ctaData.reasons.length > 0 ? ctaData.reasons : defaultReasons;

  return (
    <section className="py-10 bg-primary-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-10 md:p-12 flex items-center">
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-4"
                  >
                    {mainTitle}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="text-primary-100 mb-6"
                  >
                    {mainSubtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Link href={primaryCtaLink} className="inline-block bg-white text-primary-600 hover:bg-gray-100 py-3 px-6 rounded-lg font-semibold shadow-md transition-colors">
                      {primaryCtaText}
                    </Link>
                    <Link href={secondaryCtaLink} className="inline-block ml-3 text-white border-2 border-white hover:bg-white hover:text-primary-600 py-3 px-6 rounded-lg font-semibold transition-colors">
                      {secondaryCtaText}
                    </Link>
                  </motion.div>
                </div>
              </div>
              
              <div className="p-10 md:p-12">
                <motion.h4 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-xl font-bold text-gray-900 mb-6"
                >
                  {whyTitle}
                </motion.h4>
                
                <div className="space-y-4">
                  {reasonsList.map((reason, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h5 className="text-base font-semibold text-gray-900">{reason.title}</h5>
                        <p className="text-gray-600 text-sm">{reason.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;