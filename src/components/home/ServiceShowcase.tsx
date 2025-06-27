import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaLightbulb, 
  FaUsers, 
  FaRocket,
  FaCode,
  FaRobot,
  FaCogs,
  FaChartLine
} from 'react-icons/fa';

const ServiceShowcase = () => {
  const academyFeatures = [
    {
      icon: <FaGraduationCap className="w-6 h-6" />,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with real-world experience"
    },
    {
      icon: <FaCode className="w-6 h-6" />,
      title: "Hands-On Projects",
      description: "Build portfolio-worthy projects while learning"
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Community Support",
      description: "Join a thriving community of learners and mentors"
    }
  ];

  const consultingFeatures = [
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Digital Transformation",
      description: "Modernize your business with cutting-edge technology"
    },
    {
      icon: <FaRobot className="w-6 h-6" />,
      title: "AI Solutions",
      description: "Leverage artificial intelligence to automate and optimize"
    },
    {
      icon: <FaCogs className="w-6 h-6" />,
      title: "Technical Consulting",
      description: "Expert guidance for your technology stack and architecture"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-200 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
            Two Paths to IT Excellence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're looking to advance your career or transform your business, we have the expertise to guide you to success.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Academy Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mr-4">
                <FaGraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">ITWala Academy</h3>
                <p className="text-accent-600 font-semibold">Shape Your Career</p>
              </div>
            </div>

            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Master in-demand technologies with our comprehensive courses designed by industry experts. 
              From beginner to advanced, we'll guide you every step of the way.
            </p>

            <div className="space-y-6 mb-8">
              {academyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <div className="text-accent-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8 p-4 bg-accent-50 rounded-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">500+</div>
                <div className="text-xs text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">8+</div>
                <div className="text-xs text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">20+</div>
                <div className="text-xs text-gray-600">Learning Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">80%</div>
                <div className="text-xs text-gray-600">Job Placement</div>
              </div>
            </div>

            <Link href="/academy">
              <div className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold py-4 px-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Explore Academy Courses
              </div>
            </Link>
          </motion.div>

          {/* Consulting Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mr-4">
                <FaLightbulb className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">ITWala Consulting</h3>
                <p className="text-primary-600 font-semibold">Transform Your Business</p>
              </div>
            </div>

            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Accelerate your business growth with our expert IT consulting services. 
              From strategy to implementation, we deliver solutions that drive results.
            </p>

            <div className="space-y-6 mb-8">
              {consultingFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <div className="text-primary-600">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-primary-50 rounded-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">20+</div>
                <div className="text-xs text-gray-600">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">50+</div>
                <div className="text-xs text-gray-600">Consultants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">98%</div>
                <div className="text-xs text-gray-600">Customer Satisfication</div>
              </div>
            </div>

            <Link href="/consulting">
              <div className="w-full bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white font-semibold py-4 px-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Explore Consulting Services
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Whether you're looking to advance your skills or transform your business, 
              we're here to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <div className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                  Get Free Consultation
                </div>
              </Link>
              <Link href="/about">
                <div className="px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105">
                  Learn More About Us
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceShowcase;