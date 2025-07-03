import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaRocket, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const DigitalTransformation: NextPage = () => {
  return (
    <>
      <Head>
        <title>Digital Transformation - ITWala Consulting</title>
        <meta name="description" content="Comprehensive digital transformation services to modernize your business processes and technology infrastructure." />
      </Head>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-purple-100 text-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center">
                  <FaRocket className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Digital Transformation</h1>
              <p className="text-xl text-gray-600 mb-8">
                Comprehensive digital transformation services to modernize your business processes and technology infrastructure.
              </p>
              <Link href="/consulting">
                <div className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold">
                  <FaArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Services
                </div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Our digital transformation services help organizations modernize their operations, improve efficiency, and stay competitive in the digital age through strategic technology adoption and process optimization.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Strategy Development</h3>
                        <p className="text-gray-600">Comprehensive digital roadmaps aligned with business objectives and market opportunities.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Automation</h3>
                        <p className="text-gray-600">Streamline operations through intelligent automation and workflow optimization.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud Migration</h3>
                        <p className="text-gray-600">Seamless migration to cloud platforms for improved scalability and cost efficiency.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Analytics & Insights</h3>
                        <p className="text-gray-600">Transform data into actionable insights for better decision-making and business intelligence.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-purple-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Management</h3>
                        <p className="text-gray-600">Support teams through digital adoption with training and change management strategies.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gray-50 rounded-2xl p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Transformation Areas</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Business Process Optimization</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Workflow automation</li>
                        <li>• Process reengineering</li>
                        <li>• Performance monitoring</li>
                        <li>• Quality improvement</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Technology Modernization</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Legacy system migration</li>
                        <li>• Cloud infrastructure</li>
                        <li>• API integration</li>
                        <li>• Security enhancement</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Customer Experience</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Digital touchpoints</li>
                        <li>• Omnichannel strategy</li>
                        <li>• Personalization</li>
                        <li>• Self-service portals</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Transformation Timeline (Directional)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assessment & Planning</span>
                        <span className="text-gray-900 font-medium">4-6 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pilot Implementation</span>
                        <span className="text-gray-900 font-medium">8-12 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Rollout</span>
                        <span className="text-gray-900 font-medium">6-12 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Optimization</span>
                        <span className="text-gray-900 font-medium">Ongoing</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/contact">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Contact Us
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Expected Outcomes</h2>
                <p className="text-lg text-gray-600">Measurable benefits from digital transformation</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center"
                >
                  <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">30%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Reduction</h3>
                  <p className="text-gray-600">Average operational cost savings through automation</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">50%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Faster Processes</h3>
                  <p className="text-gray-600">Improvement in process execution time</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center"
                >
                  <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">25%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Growth</h3>
                  <p className="text-gray-600">Average revenue increase from digital initiatives</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center"
                >
                  <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">90%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Satisfaction</h3>
                  <p className="text-gray-600">Employee and customer satisfaction improvement</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Business?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Start your digital transformation journey with our expert guidance and proven methodologies.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <div className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    Schedule Assessment
                  </div>
                </Link>
                <Link href="/consulting">
                  <div className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    View All Services
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DigitalTransformation;