import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaArrowLeft, FaCheckCircle, FaRocket } from 'react-icons/fa';

const TrainingDevelopment: NextPage = () => {
  return (
    <>
      <Head>
        <title>Training & Development - ITWala Consulting</title>
        <meta name="description" content="Comprehensive training programs and skill development services to empower your team with cutting-edge technology expertise." />
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
                <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-500 shrink-0">
                  <FaGraduationCap className="w-5 h-5" />
                </div>
                <div className="h-px w-10 bg-primary-500 shrink-0" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">Consulting Services</span>
              </div>
              <h1 className="font-serif text-[2.4rem] sm:text-[3rem] lg:text-[3.4rem] leading-[1.06] text-gray-900 mb-5">
                Training &amp;{' '}
                <span className="text-gradient">Development</span>
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-[3px] h-9 bg-accent-500 rounded-full shrink-0" />
                <p className="text-[1.05rem] text-gray-600 font-medium leading-snug">
                  Through ITwala Academy
                  <span className="text-gray-400 font-normal"> · comprehensive team training &amp; skill development</span>
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
                    Our training and development programs are designed to upskill your team with the latest technologies and best practices. We offer customized learning paths that align with your business objectives and career growth goals.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-orange-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Skills Training</h3>
                        <p className="text-gray-600">Hands-on training in programming languages, frameworks, and development tools.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-orange-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud & DevOps Training</h3>
                        <p className="text-gray-600">Comprehensive training on cloud platforms, containerization, and CI/CD practices.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-orange-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI & Machine Learning</h3>
                        <p className="text-gray-600">Training programs on artificial intelligence, machine learning, and data science.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-orange-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Agile & Project Management</h3>
                        <p className="text-gray-600">Training on agile methodologies, scrum practices, and project management tools.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-orange-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Corporate Training</h3>
                        <p className="text-gray-600">Tailored training programs designed specifically for your organization&apos;s needs.</p>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Training Formats</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Delivery Methods</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• In-person workshops and bootcamps</li>
                        <li>• Virtual live training sessions</li>
                        <li>• Self-paced online courses</li>
                        <li>• Hybrid learning programs</li>
                        <li>• One-on-one mentoring</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Learning Approaches</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Project-based learning</li>
                        <li>• Interactive coding sessions</li>
                        <li>• Case study analysis</li>
                        <li>• Peer collaboration</li>
                        <li>• Real-world simulations</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Certification Programs</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Industry-recognized certifications</li>
                        <li>• Skill assessment and validation</li>
                        <li>• Continuing education credits</li>
                        <li>• Professional development tracking</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Training Program Structure (Directional)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assessment & Planning</span>
                        <span className="text-gray-900 font-medium">1 week</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Core Training Modules</span>
                        <span className="text-gray-900 font-medium">4-12 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Practical Projects</span>
                        <span className="text-gray-900 font-medium">2-4 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Evaluation & Certification</span>
                        <span className="text-gray-900 font-medium">1 week</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/contact">
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Contact Us
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Training Tracks Section */}
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Training Tracks</h2>
                <p className="text-lg text-gray-600">Structured learning paths for different career goals</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaGraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Full-Stack Development</h3>
                  <p className="text-gray-600 mb-4">Complete web development training from frontend to backend.</p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    <li>• React/Next.js</li>
                    <li>• Node.js & Express</li>
                    <li>• Database design</li>
                    <li>• API development</li>
                    <li>• Deployment & hosting</li>
                  </ul>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Duration:</span> 12 weeks
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaGraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cloud Engineering</h3>
                  <p className="text-gray-600 mb-4">Master cloud platforms and modern infrastructure practices.</p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    <li>• AWS/Azure fundamentals</li>
                    <li>• Docker & Kubernetes</li>
                    <li>• Infrastructure as Code</li>
                    <li>• CI/CD pipelines</li>
                    <li>• Monitoring & logging</li>
                  </ul>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Duration:</span> 10 weeks
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaGraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Science & AI</h3>
                  <p className="text-gray-600 mb-4">Comprehensive training in data analysis and machine learning.</p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    <li>• Python for data science</li>
                    <li>• Machine learning algorithms</li>
                    <li>• Data visualization</li>
                    <li>• Deep learning basics</li>
                    <li>• Model deployment</li>
                  </ul>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Duration:</span> 14 weeks
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaGraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Development</h3>
                  <p className="text-gray-600 mb-4">Build native and cross-platform mobile applications.</p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    <li>• React Native</li>
                    <li>• iOS development (Swift)</li>
                    <li>• Android development (Kotlin)</li>
                    <li>• Mobile UI/UX design</li>
                    <li>• App store deployment</li>
                  </ul>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Duration:</span> 10 weeks
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaGraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cybersecurity</h3>
                  <p className="text-gray-600 mb-4">Essential security practices and threat protection strategies.</p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    <li>• Security fundamentals</li>
                    <li>• Penetration testing</li>
                    <li>• Network security</li>
                    <li>• Incident response</li>
                    <li>• Compliance frameworks</li>
                  </ul>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Duration:</span> 8 weeks
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaGraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Agile & Scrum</h3>
                  <p className="text-gray-600 mb-4">Master agile methodologies and project management practices.</p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-4">
                    <li>• Scrum framework</li>
                    <li>• Kanban methodology</li>
                    <li>• Sprint planning</li>
                    <li>• Team facilitation</li>
                    <li>• Agile coaching</li>
                  </ul>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Duration:</span> 6 weeks
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Training Outcomes</h2>
                <p className="text-lg text-gray-600">Measurable impact on team performance and productivity</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center"
                >
                  <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">85%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Skill Improvement</h3>
                  <p className="text-gray-600">Average improvement in technical competency scores</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">92%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Completion Rate</h3>
                  <p className="text-gray-600">High program completion and certification success rate</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center"
                >
                  <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">35%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Productivity Boost</h3>
                  <p className="text-gray-600">Average increase in team productivity post-training</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center"
                >
                  <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">78%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Advancement</h3>
                  <p className="text-gray-600">Participants receiving promotions within 12 months</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Upskill Your Team?</h2>
              <p className="text-lg text-gray-600 mb-8">
                {"Invest in your team's growth with our comprehensive training programs and unlock their full potential."}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <div className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    Plan Training Program
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

export default TrainingDevelopment;