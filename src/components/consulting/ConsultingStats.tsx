import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaProjectDiagram, 
  FaUsers, 
  FaGlobe, 
  FaTrophy,
  FaClock,
  FaHandshake
} from 'react-icons/fa';

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

const stats: Stat[] = [
  {
    icon: <FaProjectDiagram className="w-8 h-8" />,
    value: '20+',
    label: 'Projects Delivered',
    description: 'Successfully completed projects across various industries',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: <FaUsers className="w-8 h-8" />,
    value: '50+',
    label: 'Expert Consultants',
    description: 'Certified professionals with deep industry expertise',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: <FaGlobe className="w-8 h-8" />,
    value: '25+',
    label: 'Countries Served',
    description: 'Global reach with local expertise and understanding',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: <FaTrophy className="w-8 h-8" />,
    value: '98%',
    label: 'Client Satisfaction',
    description: 'Consistently high satisfaction rates from our clients',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    icon: <FaClock className="w-8 h-8" />,
    value: '10+',
    label: 'Years Experience',
    description: 'Decade of proven track record in IT consulting',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    icon: <FaHandshake className="w-8 h-8" />,
    value: '95%',
    label: 'Client Retention',
    description: 'Long-term partnerships built on trust and results',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  }
];

const ConsultingStats: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Proven Track Record
          </h2>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Our numbers speak for themselves - delivering exceptional results and building lasting partnerships worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/20 hover:border-white/40">
                <div className={`${stat.bgColor} ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
                  {stat.value}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {stat.label}
                </h3>
                
                <p className="text-gray-200 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional achievements section */}
        {/*
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <h3 className="text-3xl font-bold mb-8 text-white">
              Industry Recognition & Certifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-2xl p-6 mb-4 hover:bg-white/30 transition-colors">
                  <div className="text-2xl font-bold text-white mb-2">ISO 27001</div>
                  <div className="text-gray-200 text-sm">Security Certified</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-2xl p-6 mb-4 hover:bg-white/30 transition-colors">
                  <div className="text-2xl font-bold text-white mb-2">AWS</div>
                  <div className="text-gray-200 text-sm">Advanced Partner</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-2xl p-6 mb-4 hover:bg-white/30 transition-colors">
                  <div className="text-2xl font-bold text-white mb-2">Microsoft</div>
                  <div className="text-gray-200 text-sm">Gold Partner</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white/20 rounded-2xl p-6 mb-4 hover:bg-white/30 transition-colors">
                  <div className="text-2xl font-bold text-white mb-2">Agile</div>
                  <div className="text-gray-200 text-sm">Certified Teams</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        */}

        {/* Call to action */}
        {/*
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Ready to become part of our success story? Let's discuss how we can help transform your business.
          </p>
          <button className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Start Your Project Today
          </button>
        </motion.div>
        */}
      </div>
    </section>
  );
};

export default ConsultingStats;