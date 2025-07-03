import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBrain, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const AISolutions: NextPage = () => {
  return (
    <>
      <Head>
        <title>AI Solutions - ITWala Consulting</title>
        <meta name="description" content="Cutting-edge AI and machine learning solutions to automate processes and drive intelligent decision-making." />
      </Head>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-cyan-50 to-cyan-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-cyan-100 text-cyan-600 w-20 h-20 rounded-2xl flex items-center justify-center">
                  <FaBrain className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">AI Solutions</h1>
              <p className="text-xl text-gray-600 mb-8">
                Cutting-edge AI and machine learning solutions to automate processes and drive intelligent decision-making.
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
                    Our AI solutions leverage the latest in machine learning, natural language processing, and computer vision to solve complex business challenges and unlock new opportunities for growth and efficiency.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-cyan-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Machine Learning Models</h3>
                        <p className="text-gray-600">Custom ML models for prediction, classification, and pattern recognition tailored to your business needs.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-cyan-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Natural Language Processing</h3>
                        <p className="text-gray-600">Advanced NLP solutions for text analysis, sentiment analysis, and intelligent chatbots.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-cyan-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Computer Vision</h3>
                        <p className="text-gray-600">Image and video analysis solutions for object detection, facial recognition, and quality control.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-cyan-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictive Analytics</h3>
                        <p className="text-gray-600">Data-driven insights and forecasting models to support strategic decision-making.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-cyan-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Integration</h3>
                        <p className="text-gray-600">Seamless integration of AI capabilities into existing systems and workflows.</p>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Technologies</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Machine Learning Frameworks</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">TensorFlow</span>
                        <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">PyTorch</span>
                        <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">Scikit-learn</span>
                        <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">Keras</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Cloud AI Services</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">AWS AI/ML</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Google AI</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Azure AI</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">OpenAI API</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Programming Languages</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Python</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">R</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">JavaScript</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">SQL</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Implementation Process (Directional)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Problem Definition</span>
                        <span className="text-gray-900 font-medium">1-2 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data Collection & Prep</span>
                        <span className="text-gray-900 font-medium">2-4 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model Development</span>
                        <span className="text-gray-900 font-medium">4-8 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Testing & Deployment</span>
                        <span className="text-gray-900 font-medium">2-3 weeks</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/contact">
                    <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Contact Us
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Use Cases</h2>
                <p className="text-lg text-gray-600">Real-world applications across industries</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-cyan-100 text-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaBrain className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Service</h3>
                  <p className="text-gray-600 mb-4">Intelligent chatbots and virtual assistants for 24/7 customer support.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Automated ticket routing</li>
                    <li>• Sentiment analysis</li>
                    <li>• Multi-language support</li>
                    <li>• Knowledge base integration</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-cyan-100 text-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaBrain className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Fraud Detection</h3>
                  <p className="text-gray-600 mb-4">Advanced algorithms to identify and prevent fraudulent activities.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Real-time monitoring</li>
                    <li>• Anomaly detection</li>
                    <li>• Risk scoring</li>
                    <li>• Pattern recognition</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-cyan-100 text-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaBrain className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendation Systems</h3>
                  <p className="text-gray-600 mb-4">Personalized recommendations to enhance user experience and sales.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Collaborative filtering</li>
                    <li>• Content-based filtering</li>
                    <li>• Hybrid approaches</li>
                    <li>• Real-time personalization</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-cyan-100 text-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaBrain className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Supply Chain Optimization</h3>
                  <p className="text-gray-600 mb-4">AI-driven optimization for inventory management and logistics.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Demand forecasting</li>
                    <li>• Route optimization</li>
                    <li>• Inventory planning</li>
                    <li>• Supplier selection</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-cyan-100 text-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaBrain className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Control</h3>
                  <p className="text-gray-600 mb-4">Computer vision solutions for automated quality inspection.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Defect detection</li>
                    <li>• Visual inspection</li>
                    <li>• Compliance monitoring</li>
                    <li>• Process optimization</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-cyan-100 text-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaBrain className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Processing</h3>
                  <p className="text-gray-600 mb-4">Intelligent document analysis and data extraction automation.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• OCR and text extraction</li>
                    <li>• Document classification</li>
                    <li>• Data validation</li>
                    <li>• Workflow automation</li>
                  </ul>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Implementation Benefits</h2>
                <p className="text-lg text-gray-600">Measurable impact on your business operations</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center"
                >
                  <div className="bg-cyan-100 text-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">40%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Reduction</h3>
                  <p className="text-gray-600">Average operational cost savings through AI automation</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="bg-cyan-100 text-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">60%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Faster Processing</h3>
                  <p className="text-gray-600">Improvement in data processing and analysis speed</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center"
                >
                  <div className="bg-cyan-100 text-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">95%</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Accuracy Rate</h3>
                  <p className="text-gray-600">Improved accuracy in predictions and classifications</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center"
                >
                  <div className="bg-cyan-100 text-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">24/7</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Availability</h3>
                  <p className="text-gray-600">Round-the-clock automated operations and monitoring</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Harness the Power of AI?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Transform your business with intelligent AI solutions that drive efficiency and innovation.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <div className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    Discuss AI Project
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

export default AISolutions;