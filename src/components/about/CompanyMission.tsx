import React from 'react';
import { motion } from 'framer-motion';

interface MissionCard {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const missionCards: MissionCard[] = [
  {
    title: "Our Mission",
    description: "Driving innovation through education. At IT-Wala Academy, we believe in transforming aspiring technologists into industry-ready professionals through cutting-edge training and real-world project experience.",
    icon: "🎯",
    color: "from-primary-50 to-primary-100"
  },
  {
    title: "Innovation at Core",
    description: "We stay at the forefront of technology, incorporating the latest industry trends and innovative teaching methods into our curriculum. Our students learn to think creatively and solve real-world problems using modern technologies.",
    icon: "💡",
    color: "from-secondary-50 to-secondary-100"
  },
  {
    title: "Real-World Experience",
    description: "Our unique advantage lies in our integration with active software development projects. Students work on live projects, gaining invaluable hands-on experience and developing professional skills that set them apart in the tech industry.",
    icon: "💼",
    color: "from-accent-50 to-accent-100"
  }
];

const CompanyMission: React.FC = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-200 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Transforming IT Education in India
          </h2>
          <p className="text-lg text-gray-600">
            We're on a mission to make quality IT education accessible and practical
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {missionCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}
            >
              <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {card.title}
              </h3>
              <p className="text-gray-700">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyMission;