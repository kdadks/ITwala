import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaLightbulb,
  FaCogs,
  FaRocket,
  FaUsers,
  FaCode,
  FaRobot,
  FaGraduationCap
} from 'react-icons/fa';

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  bgGradient: string;
  slug: string;
}

const services: Service[] = [
   {
    title: "Product Strategy & Development",
    description: "End-to-end product development services from concept to market research to deployment, ensuring quality and scalability.",
    icon: <FaCode className="w-8 h-8" />,
    features: [
      "Market Research & Validation",
      "Go-To-Market Strategy",
      "Custom Software Development",
      "Web & Mobile App Development",
      "API Development & Integration",
      "Quality Assurance & Testing"
    ],
    color: "text-indigo-600",
    bgGradient: "from-indigo-50 to-indigo-100",
    slug: "product-development"
  },
   {
    title: "AI Powered Solutions",
    description: "Cutting-edge AI and machine learning solutions to automate processes and drive intelligent decision-making.",
    icon: <FaRobot className="w-8 h-8" />,
    features: [
      "AI Strategy & Implementation",
      "Machine Learning Models",
      "Natural Language Processing",
      "Computer Vision Solutions",
      "AI-Powered Workflow Automation",
      "Agentic AI Solutions"
    ],
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100",
    slug: "ai-solutions"
  },
    {
    title: "Digital Transformation",
    description: "Comprehensive digital transformation services to modernize your business processes and technology infrastructure.",
    icon: <FaRocket className="w-8 h-8" />,
    features: [
      "Digital Strategy Development",
      "Process Automation",
      "Cloud Migration",
      "Legacy System Modernization",
      "Change Management"
    ],
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
    slug: "digital-transformation"
  },
  {
    title: "Technical Consulting",
    description: "Expert technical guidance to optimize your technology stack, architecture, and development processes.",
    icon: <FaCogs className="w-8 h-8" />,
    features: [
      "Technology Stack Assessment",
      "Architecture Design & Review",
      "Code Quality Audits",
      "Performance Optimization",
      "Security Best Practices"
    ],
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-blue-100",
    slug: "technical-consulting"
  },

  {
    title: "IT Staffing Partner",
    description: "Connect with top-tier IT professionals and build high-performing teams tailored to your specific needs.",
    icon: <FaUsers className="w-8 h-8" />,
    features: [
      "Talent Acquisition",
      "Team Augmentation",
      "Dedicated Development Teams",
      "Skill Assessment",
      "Long-term Partnerships"
    ],
    color: "text-green-600",
    bgGradient: "from-green-50 to-green-100",
    slug: "it-staffing"
  },
 
 
  {
    title: "Training & Development",
    description: "Comprehensive training programs to upskill your team and ensure successful technology adoption.",
    icon: <FaGraduationCap className="w-8 h-8" />,
    features: [
      "Custom Training Programs",
      "Technology Workshops",
      "Certification Courses",
      "Mentorship Programs",
      "Knowledge Transfer Sessions"
    ],
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-orange-100",
    slug: "training-development"
  }
];

const ServicesGrid: React.FC = () => {
  return (
    <section id="services" className="py-8 bg-gray-50 relative overflow-hidden scroll-mt-32">
      {/* Decorative background elements */}
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
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
            Our Consulting Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive IT solutions designed to accelerate your business growth and digital transformation journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col justify-between bg-gradient-to-br ${service.bgGradient} rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-gray-300 group h-full`}
            >
              <div>
                <div className={`${service.color} mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Key Features:
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                        <svg className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Consistent Learn More button for all cards, always at the bottom */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link href={`/services/${service.slug}`} className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-300 transform hover:scale-105">
                  
                    Learn More
                  
                </Link>
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default ServicesGrid;