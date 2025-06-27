import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaPhone, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaArrowRight,
  FaCheckCircle 
} from 'react-icons/fa';

const ConsultingCTA: React.FC = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-300 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-300 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left side - Content */}
              <div className="p-8 md:p-12 text-white">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to Transform Your Business?
                  </h2>
                  <p className="text-xl text-gray-100 mb-8">
                    Let's discuss how our expert consulting services can help you achieve your digital transformation goals and drive sustainable growth.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <FaCheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                      <span className="text-gray-100">Free initial consultation and project assessment</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                      <span className="text-gray-100">Customized solutions tailored to your needs</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                      <span className="text-gray-100">Proven track record with 100+ successful projects</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                      <span className="text-gray-100">Ongoing support and maintenance included</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/contact">
                      <div className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                        Get Started Today
                        <FaArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </Link>
                    <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-700 transition-all duration-300">
                      Schedule Call
                      <FaCalendarAlt className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Right side - Contact Options */}
              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-8">
                    Get In Touch
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-white/20 rounded-lg p-3 mr-4">
                        <FaPhone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Call Us</h4>
                        <p className="text-gray-200 text-sm mb-2">Speak directly with our experts</p>
                        <a href="tel:+917982303199" className="text-white hover:text-gray-200 transition-colors">
                          +91 7982303199
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-white/20 rounded-lg p-3 mr-4">
                        <FaEnvelope className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Email Us</h4>
                        <p className="text-gray-200 text-sm mb-2">Send us your requirements</p>
                        <a href="mailto:sales@it-wala.com" className="text-white hover:text-gray-200 transition-colors">
                          sales@it-wala.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-white/20 rounded-lg p-3 mr-4">
                        <FaCalendarAlt className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Schedule Meeting</h4>
                        <p className="text-gray-200 text-sm mb-2">Book a convenient time slot</p>
                        <button className="text-white hover:text-gray-200 transition-colors">
                          Book Consultation
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-white/10 rounded-lg">
                    <p className="text-white text-sm">
                      <strong>Response Time:</strong> We typically respond within 2 hours during business hours.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                How long does a typical project take?
              </h4>
              <p className="text-gray-600 text-sm">
                Project timelines vary based on scope and complexity, typically ranging from 2-6 months for most consulting engagements.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Do you work with small businesses?
              </h4>
              <p className="text-gray-600 text-sm">
                Yes, we work with businesses of all sizes, from startups to enterprise organizations, tailoring our approach to fit your budget and needs.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                What industries do you serve?
              </h4>
              <p className="text-gray-600 text-sm">
                We have experience across multiple industries including healthcare, finance, e-commerce, manufacturing, and technology sectors.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-lg text-gray-600 mb-6">
              Still have questions? We're here to help.
            </p>
            <Link href="/contact">
              <div className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                Contact Our Team
                <FaArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsultingCTA;