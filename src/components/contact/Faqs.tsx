import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    id: 1,
    question: "How do I enroll in a course?",
    answer: "You can browse our course catalog and click on the 'Enroll Now' button on any course page. You'll need to create an account or sign in if you already have one. Then follow the checkout process to complete your enrollment."
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, UPI payments, and net banking for Indian students. For corporate training, we also offer invoice-based payments and purchase orders."
  },
  {
    id: 3,
    question: "Do you offer any refunds?",
    answer: "Yes, we have a 30-day money-back guarantee for most courses. If you're unsatisfied with your purchase, you can request a refund within 30 days of enrollment, provided you haven't completed more than 25% of the course."
  },
  {
    id: 4,
    question: "How long do I have access to a course after enrolling?",
    answer: "Once enrolled, you have lifetime access to the course materials. You can learn at your own pace and revisit the content whenever you need to refresh your knowledge."
  },
  {
    id: 5,
    question: "Do you offer corporate training programs?",
    answer: "Yes, we offer customized corporate training programs for teams and organizations. Please contact our sales team at sales@it-wala.com for more information about corporate packages and custom curriculum."
  },
  {
    id: 6,
    question: "Will I receive a certificate after completing a course?",
    answer: "Yes, you will receive a certificate of completion once you finish all the required lessons and assignments in a course. Certificates can be downloaded digitally and shared on platforms like LinkedIn."
  }
];

const Faqs = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our courses and services
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      openId === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a
              href="mailto:sales@it-wala.com"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact our support team
              <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;