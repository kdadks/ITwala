import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaLightbulb, 
  FaCogs, 
  FaRocket, 
  FaHandshake 
} from 'react-icons/fa';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  details: string[];
}

const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery & Analysis",
    description: "We start by understanding your business goals, current challenges, and technical requirements through comprehensive analysis.",
    icon: <FaSearch className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    details: [
      "Business requirements gathering",
      "Current system assessment",
      "Stakeholder interviews",
      "Technical audit and analysis"
    ]
  },
  {
    step: 2,
    title: "Strategy & Planning",
    description: "Based on our findings, we develop a comprehensive strategy and detailed project roadmap tailored to your specific needs.",
    icon: <FaLightbulb className="w-6 h-6" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    details: [
      "Solution architecture design",
      "Technology stack selection",
      "Project timeline creation",
      "Resource allocation planning"
    ]
  },
  {
    step: 3,
    title: "Implementation",
    description: "Our expert team executes the plan with precision, following agile methodologies and maintaining constant communication.",
    icon: <FaCogs className="w-6 h-6" />,
    color: "text-green-600",
    bgColor: "bg-green-100",
    details: [
      "Agile development process",
      "Regular progress updates",
      "Quality assurance testing",
      "Continuous integration/deployment"
    ]
  },
  {
    step: 4,
    title: "Deployment & Launch",
    description: "We ensure smooth deployment with minimal disruption to your operations, including comprehensive testing and user training.",
    icon: <FaRocket className="w-6 h-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    details: [
      "Production deployment",
      "Performance monitoring",
      "User training sessions",
      "Go-live support"
    ]
  },
  {
    step: 5,
    title: "Support & Optimization",
    description: "Post-launch, we provide ongoing support, monitoring, and optimization to ensure continued success and growth.",
    icon: <FaHandshake className="w-6 h-6" />,
    color: "text-red-600",
    bgColor: "bg-red-100",
    details: [
      "24/7 technical support",
      "Performance optimization",
      "Regular maintenance",
      "Feature enhancements"
    ]
  }
];

const ProcessSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-300 rounded-full -translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary-300 rounded-full translate-x-1/2 blur-3xl"></div>
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
            Our Proven Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A systematic approach that ensures successful project delivery from concept to completion
          </p>
        </motion.div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary-200 via-secondary-200 to-primary-200 transform -translate-y-1/2"></div>
            <div className="flex justify-between items-stretch gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative flex flex-col items-center max-w-xs flex-1"
                >
                  {/* Step circle and number, now inside the card and centered */}
                  <div className="flex flex-col items-center -mb-8">
                    <div className={`relative flex items-center justify-center z-20`}>
                      <div className={`${step.bgColor} ${step.color} w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {step.icon}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold z-30 border-2 border-white">
                        {step.step}
                      </div>
                    </div>
                  </div>
                  {/* Content card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full min-h-[320px] w-full mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed text-center">
                      {step.description}
                    </p>
                    <ul className="space-y-1 mt-auto">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start text-xs text-gray-500">
                          <svg className="w-3 h-3 text-primary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Vertical View */}
        <div className="lg:hidden space-y-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start space-x-4">
                {/* Step indicator */}
                <div className="flex-shrink-0 relative">
                  <div className={`${step.bgColor} ${step.color} w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {step.step}
                  </div>
                  {/* Connecting line */}
                  {index < processSteps.length - 1 && (
                    <div className="absolute top-12 left-1/2 w-0.5 h-16 bg-gradient-to-b from-primary-200 to-secondary-200 transform -translate-x-1/2"></div>
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col min-h-[240px]">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-2 mt-auto">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start text-sm text-gray-500">
                        <svg className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;