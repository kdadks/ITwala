import React from 'react';
import { motion } from 'framer-motion';

interface MissionCard {
  title: string;
  description: string;
  icon: string;
}

const missionCards: MissionCard[] = [
  {
    title: "Our Mission",
    description: "Driving innovation through education. At IT-Wala Academy, we believe in transforming aspiring technologists into industry-ready professionals through cutting-edge training and real-world project experience.",
    icon: "🎯"
  },
  {
    title: "Innovation at Core",
    description: "We stay at the forefront of technology, incorporating the latest industry trends and innovative teaching methods into our curriculum. Our students learn to think creatively and solve real-world problems using modern technologies.",
    icon: "💡"
  },
  {
    title: "Real-World Experience",
    description: "Our unique advantage lies in our integration with active software development projects. Students work on live projects, gaining invaluable hands-on experience and developing professional skills that set them apart in the tech industry.",
    icon: "💼"
  }
];

const CompanyMission: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
              className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {card.title}
              </h3>
              <p className="text-gray-600">
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