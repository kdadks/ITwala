import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCogs, FaArrowLeft, FaCheckCircle, FaRocket } from 'react-icons/fa';

const TechnicalConsulting: NextPage = () => {
  return (
    <>
      <Head>
        <title>Technical Consulting - ITWala Consulting</title>
        <meta name="description" content="Expert technical guidance and architecture consulting to optimize your technology stack and development processes." />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white pt-8 pb-20">
          <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />
          <div className="relative container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shrink-0">
                  <FaCogs className="w-5 h-5" />
                </div>
                <div className="h-px w-10 bg-primary-500 shrink-0" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">Consulting Services</span>
              </div>
              <h1 className="font-serif text-[2.4rem] sm:text-[3rem] lg:text-[3.4rem] leading-[1.06] text-gray-900 mb-5">
                Technical{' '}
                <span className="text-gradient">Consulting</span>
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-[3px] h-9 bg-accent-500 rounded-full shrink-0" />
                <p className="text-[1.05rem] text-gray-600 font-medium leading-snug">
                  Expert technical guidance
                  <span className="text-gray-400 font-normal"> · architecture consulting &amp; stack optimization</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/contact">
                  <span className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white h-12 px-7 rounded-lg font-semibold text-sm shadow-md shadow-primary-500/20 transition-all duration-200">
                    <FaRocket className="w-3.5 h-3.5" />
                    Start Your Project
                  </span>
                </Link>
                <Link href="/consulting">
                  <span className="inline-flex items-center gap-1.5 h-12 px-5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm font-medium transition-all duration-200">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Services
                  </span>
                </Link>
              </div>
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
                    Our technical consulting services provide expert guidance on technology architecture, development best practices, and technical decision-making to ensure your projects are built on solid foundations.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">System Architecture Design</h3>
                        <p className="text-gray-600">Scalable and robust architecture design for web applications, microservices, and cloud-native solutions.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Technology Stack Selection</h3>
                        <p className="text-gray-600">Expert guidance on choosing the right technologies, frameworks, and tools for your specific requirements.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Code Review & Optimization</h3>
                        <p className="text-gray-600">Comprehensive code reviews and performance optimization to improve code quality and system efficiency.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">DevOps & CI/CD Implementation</h3>
                        <p className="text-gray-600">Setup and optimization of development workflows, automated testing, and deployment pipelines.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Assessment</h3>
                        <p className="text-gray-600">Security audits and implementation of best practices to protect your applications and data.</p>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Technical Expertise</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Frontend Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">React</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Next.js</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Vue.js</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Angular</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">TypeScript</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Backend Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Node.js</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Python</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Java</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">.NET</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Go</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Cloud & DevOps</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">AWS</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Azure</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Docker</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Kubernetes</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">CI/CD</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Consultation Process (Directional)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Technical Assessment</span>
                        <span className="text-gray-900 font-medium">1-2 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Architecture Planning</span>
                        <span className="text-gray-900 font-medium">2-3 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Implementation Guidance</span>
                        <span className="text-gray-900 font-medium">Ongoing</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Review & Optimization</span>
                        <span className="text-gray-900 font-medium">1-2 weeks</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/contact">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Contact Us
                    </button>
                  </Link>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Technical Expertise?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Let our technical experts help you make the right technology decisions and build robust solutions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <div className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    Schedule Technical Review
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

export default TechnicalConsulting;