import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

const aiEducationFAQs: FAQItem[] = [
  {
    question: "What makes ITWala Academy the best AI education platform?",
    answer: "ITWala Academy stands out as a premier AI education platform with expert instructors who have real industry experience, comprehensive curriculum covering artificial intelligence, machine learning, and data science, hands-on projects with real datasets, industry-recognized certifications, and dedicated career support. Our 500+ successful graduates are proof of our excellence in AI education."
  },
  {
    question: "What AI and Machine Learning courses do you offer?",
    answer: "We offer comprehensive AI education programs including AI & Machine Learning Fundamentals, Deep Learning with Neural Networks, Data Science Professional Program, Natural Language Processing, Computer Vision, AI for Business Applications, Machine Learning Engineering, and Advanced AI Research Methods. Each course includes hands-on projects and industry certifications."
  },
  {
    question: "How long does it take to complete an AI course at ITWala Academy?",
    answer: "Our AI education programs are designed for flexible learning. Most courses range from 8-16 weeks depending on complexity. The AI & Machine Learning Fundamentals course takes 8 weeks, while our comprehensive Data Science Professional Program takes 12-16 weeks. You can learn at your own pace with lifetime access to course materials."
  },
  {
    question: "Do I need programming experience to start learning AI?",
    answer: "No prior AI experience is required for our beginner courses! Our AI education curriculum is designed for learners at all levels. We start with Python fundamentals and gradually build up to advanced AI concepts. Our structured approach ensures that even complete beginners can master artificial intelligence and machine learning effectively."
  },
  {
    question: "What career opportunities are available after completing AI courses?",
    answer: "Our AI education graduates have excellent career prospects including AI Engineer, Machine Learning Engineer, Data Scientist, AI Research Scientist, Computer Vision Engineer, NLP Engineer, AI Product Manager, and AI Consultant. The AI industry offers some of the highest-paying jobs in technology with average salaries ranging from ₹8-50 lakhs per annum."
  },
  {
    question: "Are ITWala Academy AI certifications recognized by employers?",
    answer: "Yes! Our AI education certifications are industry-recognized and valued by top employers. We partner with leading companies and our curriculum is designed based on real industry requirements. Our graduates work at companies like Google, Microsoft, Amazon, and top startups, demonstrating the value of our AI education programs."
  },
  {
    question: "What practical projects will I work on during the AI courses?",
    answer: "Our AI education includes hands-on projects like building recommendation systems, creating chatbots using NLP, developing computer vision applications for object detection, building predictive models for business forecasting, implementing neural networks for image classification, and deploying machine learning models to production environments."
  },
  {
    question: "How is online AI education different from traditional classroom learning?",
    answer: "Our online AI education platform offers advantages like flexible scheduling, access to recorded lectures for review, interactive coding environments, direct mentorship from AI experts, global community of learners, and cost-effective learning without compromising quality. You get the same comprehensive AI education with added convenience and accessibility."
  },
  {
    question: "What support do you provide for AI career transition?",
    answer: "ITWala Academy provides comprehensive career support including resume optimization for AI roles, interview preparation with AI-specific questions, portfolio development with real projects, job placement assistance, networking opportunities with AI professionals, and ongoing mentorship even after course completion. We're committed to your success in the AI field."
  },
  {
    question: "How do you ensure the AI curriculum stays current with industry trends?",
    answer: "Our AI education curriculum is continuously updated by industry experts who work with the latest AI technologies. We regularly incorporate new developments in artificial intelligence, machine learning frameworks, and emerging AI applications. Our advisory board includes AI leaders from top companies ensuring our content remains cutting-edge and industry-relevant."
  }
];

const AIEducationFAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": aiEducationFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* Schema markup for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions About AI Education
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get answers to common questions about our AI and machine learning courses, career prospects, and learning experience.
              </p>
            </motion.div>

            <div className="space-y-4">
              {aiEducationFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        openItems.includes(index) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {openItems.includes(index) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-12"
            >
              <p className="text-gray-600 mb-6">
                Still have questions about our AI education programs?
              </p>
              <a
                href="/contact"
                className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Contact Our AI Education Experts
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AIEducationFAQ;