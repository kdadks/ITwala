import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaAward, 
  FaClock, 
  FaShieldAlt, 
  FaHandshake, 
  FaChartLine, 
  FaGlobe 
} from 'react-icons/fa';

interface Advantage {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const advantages: Advantage[] = [
  {
    title: "Proven Expertise",
    description: "Over 10 years of experience delivering successful IT solutions across diverse industries with a track record of 20+ completed projects.",
    icon: <FaAward className="w-6 h-6" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  },
  {
    title: "Rapid Delivery",
    description: "Agile methodologies and efficient processes ensure faster time-to-market without compromising on quality or functionality.",
    icon: <FaClock className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    title: "Enterprise Security",
    description: "Industry-leading security practices and compliance standards to protect your data and ensure regulatory adherence.",
    icon: <FaShieldAlt className="w-6 h-6" />,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    title: "Long-term Partnership",
    description: "We build lasting relationships with our clients, providing ongoing support and evolving solutions as your business grows.",
    icon: <FaHandshake className="w-6 h-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    title: "Scalable Solutions",
    description: "Future-proof architectures designed to scale with your business needs, from startup to enterprise level.",
    icon: <FaChartLine className="w-6 h-6" />,
    color: "text-red-600",
    bgColor: "bg-red-100"
  },
  {
    title: "Global Reach",
    description: "International experience with local expertise, serving clients across multiple time zones and cultural contexts.",
    icon: <FaGlobe className="w-6 h-6" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100"
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-8 bg-white relative overflow-hidden scroll-mt-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary-300 rounded-full -translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-secondary-300 rounded-full translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
            Why Choose ITWala?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine technical excellence with business acumen to deliver solutions that drive real results for your organization
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group h-full"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-primary-200 flex flex-col h-full">
                <div className={`${advantage.bgColor} ${advantage.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {advantage.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors">
                  {advantage.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed flex-1">
                  {advantage.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional value proposition section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-20 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Your Success is Our Priority
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                At ITWala, we don't just deliver projects – we deliver outcomes. Our client-centric approach ensures that every solution we build directly contributes to your business objectives and long-term success.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dedicated Project Management</h4>
                    <p className="text-gray-600">Assigned project managers ensure seamless communication and timely delivery</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Transparent Communication</h4>
                    <p className="text-gray-600">Regular updates and clear reporting keep you informed at every step</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900">Post-Launch Support</h4>
                    <p className="text-gray-600">Comprehensive maintenance and support services beyond project completion</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
                  <div className="text-gray-600 mb-6">Client Satisfaction Rate</div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-secondary-600">20+</div>
                      <div className="text-sm text-gray-600">Projects Delivered</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent-600">24/7</div>
                      <div className="text-sm text-gray-600">Support Available</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-600">50+</div>
                      <div className="text-sm text-gray-600">Expert Consultants</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary-600">10+</div>
                      <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;