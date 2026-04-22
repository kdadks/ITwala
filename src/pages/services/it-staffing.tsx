import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUsers, FaArrowLeft, FaCheckCircle, FaRocket } from 'react-icons/fa';

const ITStaffing: NextPage = () => {
  return (
    <>
      <Head>
        <title>IT Staffing Partner - ITWala Consulting</title>
        <meta name="description" content="Strategic IT staffing solutions to help you find and retain top technical talent for your projects and teams." />
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
                  <FaUsers className="w-5 h-5" />
                </div>
                <div className="h-px w-10 bg-primary-500 shrink-0" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">Consulting Services</span>
              </div>
              <h1 className="font-serif text-[2.4rem] sm:text-[3rem] lg:text-[3.4rem] leading-[1.06] text-gray-900 mb-5">
                IT Staffing{' '}
                <span className="text-gradient">Partner</span>
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-[3px] h-9 bg-accent-500 rounded-full shrink-0" />
                <p className="text-[1.05rem] text-gray-600 font-medium leading-snug">
                  Strategic IT staffing solutions
                  <span className="text-gray-400 font-normal"> · find &amp; retain top technical talent</span>
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
                    Our IT staffing services connect you with skilled professionals who can drive your technology initiatives forward. We specialize in finding the right talent for your specific needs and culture.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contract Staffing</h3>
                        <p className="text-gray-600">Flexible contract professionals for project-based work and temporary assignments.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Permanent Placement</h3>
                        <p className="text-gray-600">Full-time hiring solutions for long-term team building and organizational growth.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contract-to-Hire</h3>
                        <p className="text-gray-600">Try-before-you-hire approach to evaluate candidates before permanent commitment.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Augmentation</h3>
                        <p className="text-gray-600">Scale your existing teams with specialized skills and expertise as needed.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-green-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Executive Search</h3>
                        <p className="text-gray-600">Senior-level technology leadership recruitment for strategic positions.</p>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Talent Pool</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Development Roles</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Frontend Developers</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Backend Developers</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Full Stack Developers</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Mobile Developers</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Specialized Roles</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">DevOps Engineers</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Data Scientists</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Cloud Architects</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Security Specialists</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Leadership Roles</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Tech Leads</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Engineering Managers</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Delivery Directors</span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Product Managers</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Hiring Process (Directional)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Requirements Analysis</span>
                        <span className="text-gray-900 font-medium">1-2 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Candidate Sourcing</span>
                        <span className="text-gray-900 font-medium">3-5 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Screening & Interviews</span>
                        <span className="text-gray-900 font-medium">1-2 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Final Selection</span>
                        <span className="text-gray-900 font-medium">2-3 days</span>
                      </div>
                    </div>
                  </div>
                    
                  <Link href="/contact">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Contact Us
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ITWala as Your Staffing Partner?</h2>
                <p className="text-lg text-gray-600">Our proven approach to IT staffing delivers results</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">95%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Rate</h3>
                  <p className="text-gray-600">High placement success rate with long-term retention</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">48h</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Turnaround</h3>
                  <p className="text-gray-600">Fast candidate presentation for urgent requirements</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">5K+</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Talent Network</h3>
                  <p className="text-gray-600">Extensive network of pre-screened IT professionals</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">24/7</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
                  <p className="text-gray-600">Continuous support throughout the engagement</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">90d</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Guarantee</h3>
                  <p className="text-gray-600">90-day replacement guarantee for permanent placements</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">100%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Vetted Talent</h3>
                  <p className="text-gray-600">Thoroughly screened and technically assessed candidates</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Build Your Dream Team?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Let us help you find the perfect IT professionals to drive your projects forward.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <div className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    Submit Staffing Request
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

export default ITStaffing;