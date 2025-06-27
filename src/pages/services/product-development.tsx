import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCode, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const ProductDevelopment: NextPage = () => {
  return (
    <>
      <Head>
        <title>Product Development - ITWala Consulting</title>
        <meta name="description" content="End-to-end product development services from concept to launch, building scalable and user-centric solutions." />
      </Head>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-indigo-100 text-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center">
                  <FaCode className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Product Development</h1>
              <p className="text-xl text-gray-600 mb-8">
                End-to-end product development services from concept to launch, building scalable and user-centric solutions.
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
                    Our product development services cover the entire lifecycle from ideation to deployment. We build robust, scalable, and user-friendly products that drive business growth and customer satisfaction.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">MVP Development</h3>
                        <p className="text-gray-600">Rapid prototyping and minimum viable product development to validate your ideas quickly.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Full-Stack Development</h3>
                        <p className="text-gray-600">Complete web and mobile application development using modern technologies and frameworks.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">UI/UX Design</h3>
                        <p className="text-gray-600">User-centered design and intuitive interfaces that enhance user experience and engagement.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">API Development</h3>
                        <p className="text-gray-600">Robust and scalable API development for seamless integration and data exchange.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                        <p className="text-gray-600">Comprehensive testing and quality assurance to ensure reliable and bug-free products.</p>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Development Approach</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Agile Methodology</h4>
                      <p className="text-gray-600 mb-3">We follow agile development practices for faster delivery and continuous improvement.</p>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        <li>• Sprint-based development</li>
                        <li>• Regular stakeholder feedback</li>
                        <li>• Iterative improvements</li>
                        <li>• Transparent communication</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Technology Stack</h4>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">React/Next.js</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Node.js</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Python/Django</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">React Native</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">AWS/Azure</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">PostgreSQL</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Quality Standards</h4>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        <li>• Code reviews and best practices</li>
                        <li>• Automated testing and CI/CD</li>
                        <li>• Performance optimization</li>
                        <li>• Security implementation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Development Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discovery & Planning</span>
                        <span className="text-gray-900 font-medium">1-2 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Design & Prototyping</span>
                        <span className="text-gray-900 font-medium">2-3 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Development Sprints</span>
                        <span className="text-gray-900 font-medium">8-16 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Testing & Deployment</span>
                        <span className="text-gray-900 font-medium">2-3 weeks</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/contact">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Contact Us
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Types Section */}
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Products We Build</h2>
                <p className="text-lg text-gray-600">Diverse range of digital products across industries</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Web Applications</h3>
                  <p className="text-gray-600 mb-4">Responsive web apps with modern frameworks and cloud deployment.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• SaaS platforms</li>
                    <li>• E-commerce solutions</li>
                    <li>• Business dashboards</li>
                    <li>• Content management systems</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Applications</h3>
                  <p className="text-gray-600 mb-4">Native and cross-platform mobile apps for iOS and Android.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• React Native apps</li>
                    <li>• Progressive web apps</li>
                    <li>• Enterprise mobile solutions</li>
                    <li>• Consumer applications</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">API & Backend</h3>
                  <p className="text-gray-600 mb-4">Scalable backend systems and RESTful API development.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Microservices architecture</li>
                    <li>• Database design</li>
                    <li>• Third-party integrations</li>
                    <li>• Cloud infrastructure</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">E-commerce Platforms</h3>
                  <p className="text-gray-600 mb-4">Custom e-commerce solutions with payment integration.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Online marketplaces</li>
                    <li>• B2B platforms</li>
                    <li>• Subscription services</li>
                    <li>• Multi-vendor systems</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Solutions</h3>
                  <p className="text-gray-600 mb-4">Large-scale enterprise applications and integrations.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• ERP systems</li>
                    <li>• CRM platforms</li>
                    <li>• Workflow automation</li>
                    <li>• Data analytics tools</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Products</h3>
                  <p className="text-gray-600 mb-4">Intelligent applications with machine learning capabilities.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Recommendation engines</li>
                    <li>• Chatbots and virtual assistants</li>
                    <li>• Predictive analytics</li>
                    <li>• Computer vision solutions</li>
                  </ul>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Build Your Product?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Let's transform your ideas into powerful digital products that drive business success.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <div className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    Start Your Project
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

export default ProductDevelopment;